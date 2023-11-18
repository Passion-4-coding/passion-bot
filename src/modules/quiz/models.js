const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const QuizEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  complexity: {
    type: String,
    enum: [1, 2, 3, 4, 5],
    default: 1
  },
  question: {
    type: String,
    required: true,
  },
  answerA: {
    type: String,
    required: true,
  },
  answerB: {
    type: String,
    required: true,
  },
  answerC: {
    type: String,
  },
  answerD: {
    type: String,
  },
  correct: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const PostedQuizSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true
  },
  expiredAt: {
    type: Date,
    required: true
  },
  quizId: {
    type: ObjectId,
    ref: 'quiz-questions-new',
    required: true
  },
  correctAnswers: [{
    type: ObjectId,
    ref: 'members',
    required: true
  }],
  wrongAnswers: [{
    type: ObjectId,
    ref: 'members',
    required: true
  }],
});


const QuizEntryModel = mongoose.model('quiz-questions-new', QuizEntrySchema);
const PostedQuizModel = mongoose.model('posted-quiz', PostedQuizSchema);

module.exports = {
  QuizEntrySchema,
  QuizEntryModel,
  PostedQuizModel
}