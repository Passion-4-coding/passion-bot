const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { validateAccess, scopes } = require('../auth');
const { getAllQuestions, addQuestion } = require('./services');
const { randomIntFromInterval } = require('../../utils');
const { getQuestion } = require('./services');
const { ObjectId } = require('mongodb');
const NodeCache = require( "node-cache" );
const { addKarmaForTheQuiz } = require('../karma');

const QUIZ_TIME = 3600;

const answersCache = new NodeCache( { stdTTL: QUIZ_TIME } );
const timeoutCache = new NodeCache( { stdTTL: QUIZ_TIME } );

const quizHeadMessage = "Quiz is here, you have one hour to provide an answer and earn some karma points.";

const getQuizMessage = (quiz) => {
  return `${quizHeadMessage}\n\n**${quiz.question}**`;
}

const handleQuizApi = (app, client) => {
  app.get('/api/quiz/questions', async ({ headers, body }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to get questions"});
      return;
    }
    const questions = await getAllQuestions();
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
}

const handleCorrectAnswer = async (interaction, karma, correctAnswersAmount, quiz) => {
  interaction.message.edit(`${getQuizMessage(quiz)}\n\n*Correct answers: ${correctAnswersAmount}*`)
  await addKarmaForTheQuiz(interaction.message.author.id, quiz._id, karma);
  const embed = new EmbedBuilder()
  .setTitle(`Congratulations!`)
  .setDescription(`Your answer was correct and you have earned ${karma} karma points.`);
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleWrongAnswer = (interaction) => {
  const embed = new EmbedBuilder()
  .setTitle(`Wrong answer!`)
  .setDescription("Don't worry and good luck next time");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleAnswerRepeat = (interaction) => {
  const embed = new EmbedBuilder()
  .setTitle(`Ooops, hold on!`)
  .setDescription("You have already answered this question, wait for the next one");
  return interaction.editReply({
    embeds: [embed]
  })
}

const handleQuizNotAvailable = (interaction) => {
  const embed = new EmbedBuilder()
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
  const isQuestionAlreadyAnswered = membersWhoAnswered.some(a => a.memberId === interaction.message.author.id);
  if (isQuestionAlreadyAnswered) {
    handleAnswerRepeat(interaction)
    return;
  }
  const isAnswerCorrect = question[answer] === question.correctAnswer;
  membersWhoAnswered.push({ memberId: interaction.message.author.id, correct: isAnswerCorrect });
  const amountOfCorrectAnswers = membersWhoAnswered.filter(m => m.correct).length;
  answersCache.set(questionId, membersWhoAnswered);
  if (isAnswerCorrect) {
    const karma = amountOfCorrectAnswers > 5 ? question.karmaRewardLate : question.karmaRewardEarly;
    await handleCorrectAnswer(interaction, karma, amountOfCorrectAnswers, question);
    return;
  }
  handleWrongAnswer(interaction)
}

const getQuizEmbed = async () => {
  const questions = await getAllQuestions();
  const randomQuestionIndex = randomIntFromInterval(0, questions.length - 1);
  const randomQuiz = questions[randomQuestionIndex];
  timeoutCache.set(randomQuiz._id.toString(), true);
  setInterval(() => {
    timeoutCache.set(randomQuiz._id.toString(), false);
  }, QUIZ_TIME*1000);
  const buttons = new ActionRowBuilder();
  const id = randomQuiz._id.toString();
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer1`).setLabel(randomQuiz.answer1).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer2`).setLabel(randomQuiz.answer2).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer3`).setLabel(randomQuiz.answer3).setStyle(ButtonStyle.Primary));
  buttons.addComponents(new ButtonBuilder().setCustomId(`${id}:answer4`).setLabel(randomQuiz.answer4).setStyle(ButtonStyle.Primary));
  return { content: getQuizMessage(randomQuiz), components: [buttons] };
}

module.exports = {
  handleQuizApi,
  getQuizEmbed,
  handleMemberAnswer
}