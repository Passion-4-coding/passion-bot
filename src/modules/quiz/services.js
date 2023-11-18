const { getPaginatedDataFromModel } = require("../../utils");
const { QuizEntryModel, PostedQuizModel } = require("./models");

const getAllQuestions = async (page, pageSize) => {
  return getPaginatedDataFromModel(QuizEntryModel, page, pageSize);
}

const getQuestionCount = async () => {
  return QuizEntryModel.count();
}

const getQuestionByIndex = async (index) => {
  return (await QuizEntryModel.find().skip(index).limit(1)).at(0);
}

const createPostedQuiz = async (postedQuiz) => {
  const newPostedQuiz = new PostedQuizModel(postedQuiz);
  try {
    return newPostedQuiz.save();
  } catch (error) {
    console.error(error);
  }
}

const getPostedQuizById = async (postedQuizId) => {
  return PostedQuizModel.findById(postedQuizId);
}

const updatePostedQuiz = async (postedQuizId, postedQuiz) => {
  return PostedQuizModel.findByIdAndUpdate(postedQuizId, postedQuiz);
}

const getQuestion = (id) => {
  return QuizEntryModel.findById(id);
}

const addQuestion = async (question) => {
  const newQuestion = new QuizEntryModel(question);
  try {
    return newQuestion.save();
  } catch (error) {
    console.error(error);
  }
}

const updateQuestion = async (id, question) => {
  return QuizEntryModel.updateOne({ _id: id }, question);
}

module.exports = {
  addQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
  getQuestionCount,
  getQuestionByIndex,
  createPostedQuiz,
  getPostedQuizById,
  updatePostedQuiz
}