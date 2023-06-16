const { QuizEntryModel } = require("./models");

const getAllQuestions = () => {
  return QuizEntryModel.find();
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

module.exports = {
  addQuestion,
  getAllQuestions,
  getQuestion
}