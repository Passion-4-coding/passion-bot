const mongoose = require("mongoose");

const QuizEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  karmaRewardEarly: {
    type: String,
    enum: [25, 30, 35],
    default: 25
  },
  karmaRewardLate: {
    type: String,
    enum: [15, 20, 25],
    default: 15,
  },
  question: {
    type: String,
    required: true,
  },
  answer1: {
    type: String,
    required: true,
  },
  answer2: {
    type: String,
    required: true,
  },
  answer3: {
    type: String,
  },
  answer4: {
    type: String,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const QuizEntryModel = mongoose.model('quiz-questions', QuizEntrySchema);

module.exports = {
  QuizEntrySchema,
  QuizEntryModel
}