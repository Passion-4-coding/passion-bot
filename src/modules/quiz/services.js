const { getPaginatedDataFromModel } = require("../../utils");
const { QuizEntryModel } = require("./models");

const getAllQuestions = async (page, pageSize) => {
  return getPaginatedDataFromModel(QuizEntryModel, page, pageSize);
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
}