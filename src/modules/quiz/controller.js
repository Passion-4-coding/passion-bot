const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { validateAccess, scopes } = require('../auth');
const { getAllQuestions, addQuestion, updateQuestion } = require('./services');
const { randomIntFromInterval } = require('../../utils');
const { getQuestion } = require('./services');
const { ObjectId } = require('mongodb');
const NodeCache = require( "node-cache" );
const { addKarmaForTheQuiz } = require('../karma');
const { colors, images } = require('../../constants');

const QUIZ_TIME = 7200;

const answersCache = new NodeCache( { stdTTL: QUIZ_TIME } );
const timeoutCache = new NodeCache( { stdTTL: QUIZ_TIME } );

const quizHeadMessage = "Quiz is here, you have two hours to provide an answer and earn some karma points.";

const getQuizMessage = (quiz) => {
  return `${quizHeadMessage}\n\n**${quiz.question}**`;
}

const getQuizEmbed = (quiz, answersAmount = 0) => {
  const karma = answersAmount >= 5 ? quiz.karmaRewardLate : quiz.karmaRewardEarly;
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

const handleCorrectAnswer = async (interaction, karma, correctAnswersAmount, quiz) => {
  const embedExisting = getQuizEmbed(quiz, correctAnswersAmount);
  embedExisting.setFooter({ text: `Correct answers: ${correctAnswersAmount}` });
  interaction.message.edit({ embeds: [embedExisting] })
  await addKarmaForTheQuiz(interaction.member.id, quiz._id, karma);
  const embed = new EmbedBuilder()
  .setColor(colors.primary)
  .setTitle(`Congratulations!`)
  .setDescription(`Your answer was correct and you have earned ${karma} karma points.`);
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleWrongAnswer = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Wrong answer!`)
  .setDescription("Don't worry and good luck next time");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleAnswerRepeat = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Ooops, hold on!`)
  .setDescription("You have already answered this question, wait for the next one");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleQuizNotAvailable = (interaction) => {
  const embed = new EmbedBuilder()
  .setColor(colors.danger)
  .setTitle(`Ooops, quiz is no longer available!`)
  .setDescription("Wait for the next one and try to be faster next time");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleMemberAnswer = async (interaction) => {
  await interaction.deferReply({
    ephemeral: true,
    fetchReply: true
  })
  const ids = interaction.customId.split(":");
  const questionId = ids[0];
  const isQuizAvailable = timeoutCache.get(questionId);
  if (!isQuizAvailable) {
    handleQuizNotAvailable(interaction);
    return;
  } 
  const answer = ids[1];
  const question = await getQuestion(new ObjectId(questionId));
  const membersWhoAnswered = answersCache.get(questionId) || [];
  const isQuestionAlreadyAnswered = membersWhoAnswered.some(a => a.memberId === interaction.member.id);
  if (isQuestionAlreadyAnswered) {
    handleAnswerRepeat(interaction)
    return;
  }
  const isAnswerCorrect = question[answer] === question.correctAnswer;
  membersWhoAnswered.push({ memberId: interaction.member.id, correct: isAnswerCorrect });
  const amountOfCorrectAnswers = membersWhoAnswered.filter(m => m.correct).length;
  answersCache.set(questionId, membersWhoAnswered);
  if (isAnswerCorrect) {
    const karma = amountOfCorrectAnswers > 5 ? question.karmaRewardLate : question.karmaRewardEarly;
    await handleCorrectAnswer(interaction, karma, amountOfCorrectAnswers, question);
    return;
  }
  handleWrongAnswer(interaction)
}

const getQuiz = async () => {
  const { list: questions } = await getAllQuestions();
  const randomQuestionIndex = randomIntFromInterval(0, questions.length - 1);
  const randomQuiz = questions[randomQuestionIndex];
  timeoutCache.set(randomQuiz._id.toString(), true);
  setInterval(() => {
    timeoutCache.set(randomQuiz._id.toString(), false);
  }, QUIZ_TIME*1000);
  const buttons = new ActionRowBuilder();
  const id = randomQuiz._id.toString();
  const embed = getQuizEmbed(randomQuiz);
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer1`).setLabel(randomQuiz.answer1).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer2`).setLabel(randomQuiz.answer2).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer3`).setLabel(randomQuiz.answer3).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer4`).setLabel(randomQuiz.answer4).setStyle(ButtonStyle.Primary));
  return { embeds: [embed], components: [buttons] };
}

module.exports = {
  handleQuizApi,
  getQuiz,
  handleMemberAnswer
}