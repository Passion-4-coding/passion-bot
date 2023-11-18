const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { validateAccess, scopes } = require('../auth');
const { getAllQuestions, addQuestion, updateQuestion, getQuestionCount, getQuestionByIndex, createPostedQuiz, getPostedQuizById, updatePostedQuiz } = require('./services');
const { randomIntFromInterval } = require('../../utils');
const { getQuestion } = require('./services');
const { addKarmaForTheQuiz } = require('../karma');
const { colors, images } = require('../../constants');
const { addHours, differenceInSeconds } = require('date-fns');
const { getMemberByDiscordId } = require('../member');
const { ObjectId } = require('mongodb');

const quizHeadMessage = "Увага, тест! У тебе є дві години щоб відповісти на питання і заробити очок карми.";

const getQuizMessage = (quiz) => {
  return `${quizHeadMessage}\n\n**${quiz.question}**\n\n**A**: ${quiz.answerA}\n**B**: ${quiz.answerB}\n**C**: ${quiz.answerC}\n**D**: ${quiz.answerD}`;
}

const getQuizEmbed = (quiz, answersAmount = 0) => {
  const karma = answersAmount >= 5 ? quiz.complexity * 10 : quiz.complexity * 15;
  return new EmbedBuilder()
  .setColor(colors.primary)
  .setDescription(getQuizMessage(quiz))
  .setThumbnail(images[`karma${karma}`]);
}

const handleQuizApi = (app, client) => {
  app.get('/api/quiz/questions', async ({ headers, query }, res) => {
    const { page = 1, pageSize = 10 } = query;
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to get questions"});
      return;
    }
    const questions = await getAllQuestions(page, pageSize);
    res.send(questions);
  })

  app.post('/api/quiz/questions', async (req, res) => {
    if (!await validateAccess(req.headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to add questions"});
      return;
    }
    const response = await addQuestion({ ...req.body, date: new Date() });
    res.send(response);
  })

  app.patch('/api/quiz/questions/:id', async ({ params, headers, body }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to edit questions"});
      return;
    }
    const response = await updateQuestion(params.id, body);
    res.send(response);
  })
}

const handleCorrectAnswer = async (client, interaction, karma, correctAnswersAmount, quiz) => {
  const embedExisting = getQuizEmbed(quiz, correctAnswersAmount);
  embedExisting.setFooter({ text: `Правильних відповідей: ${correctAnswersAmount}` });
  interaction.message.edit({ embeds: [embedExisting] })
  await addKarmaForTheQuiz(client, interaction.member.id, quiz._id, karma);
  const embed = new EmbedBuilder()
  .setColor(colors.primary)
  .setTitle(`Правильна відповідь!`)
  .setDescription(`За успішне проходження тесту ти отримуєш ${karma} очок карми.`);
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleWrongAnswer = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Неправильна відповідь!`)
  .setDescription("Не хвилюйся і нехай тобі щастить наступного разу");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleAnswerRepeat = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Упс, не вийшло!`)
  .setDescription("Я вже отримав відповідь від тебе по цьому тесту, зачекай на наступний");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleQuizNotAvailable = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Ох, тест уже недоступний!`)
  .setDescription("Я вже закрив цей тест. Зачекай на наступний і будь спритнішим");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleMemberAnswer = async (interaction, client) => {
  await interaction.deferReply({
    ephemeral: true,
    fetchReply: true
  })
  const ids = interaction.customId.split(":");
  const postedQuizId = ids[0];
  const postedQuiz = await getPostedQuizById(postedQuizId);
  const timeToExpired = differenceInSeconds(new Date(postedQuiz.expiredAt), new Date());
  const member = await getMemberByDiscordId(interaction.member.id);
  if (timeToExpired < 0) {
    handleQuizNotAvailable(interaction);
    return;
  } 
  const answer = ids[1];
  const question = await getQuestion(postedQuiz.quizId);
  const correctAnswers = postedQuiz.correctAnswers;
  const wrongAnswers = postedQuiz.wrongAnswers;
  const allAnswers = [...correctAnswers, ...wrongAnswers];
  const isQuestionAlreadyAnswered = allAnswers.some(id => id.toString() === member._id.toString());
  if (isQuestionAlreadyAnswered) {
    handleAnswerRepeat(interaction);
    return;
  }
  const isAnswerCorrect = answer === question.correct;
  if (isAnswerCorrect) {
    correctAnswers.push(member._id);
  } else {
    wrongAnswers.push(member._id);
  }
  await updatePostedQuiz(postedQuizId, { ...postedQuiz, correctAnswers, wrongAnswers });
  if (isAnswerCorrect) {
    const karma = correctAnswers.length > 5 ? question.complexity * 10 : question.complexity * 15;
    await handleCorrectAnswer(client, interaction, karma, correctAnswers.length, question);
    return;
  }
  handleWrongAnswer(interaction)
}

const getQuiz = async () => {
  const count = await getQuestionCount();
  const randomQuestionIndex = randomIntFromInterval(0, count - 1);
  const randomQuiz = await getQuestionByIndex(randomQuestionIndex);
  const postedQuiz = await createPostedQuiz({
    createdAt: new Date(),
    expiredAt: addHours(new Date(), 2),
    quizId: randomQuiz._id,
    correctAnswers: [],
    wrongAnswers: [],
  });
  const buttons = new ActionRowBuilder();
  const id = postedQuiz._id.toString();
  const embed = getQuizEmbed(randomQuiz);
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:A`).setLabel("A").setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:B`).setLabel("B").setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:C`).setLabel("C").setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:D`).setLabel("D").setStyle(ButtonStyle.Primary));
  return { embeds: [embed], components: [buttons] };
}

module.exports = {
  handleQuizApi,
  getQuiz,
  handleMemberAnswer
}