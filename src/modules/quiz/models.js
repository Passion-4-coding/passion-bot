const mongoose = require("mongoose");

const QuizEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  karmaRewardEarly: {
    type: String,
    enum: [15, 20, 25],
    default: 15
  },
  karmaRewardLate: {
    type: String,
    enum: [5, 10, 15],
    default: 5,
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