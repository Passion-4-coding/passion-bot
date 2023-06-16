const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const KarmaEntrySchema = new mongoose.Schema({
  memberId: {
    type: ObjectId,
    ref: 'members',
    required: true
  },
  karma: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["manual", "bump", "message", "swear-word", "content-making", "quiz"]
  },
  target: String,
  quizId: {
    type: ObjectId,
    ref: 'quiz-questions',
    required: function() {
      return this.type === "quiz";
    }
  }
});

const KarmaEntryModel = mongoose.model('karma-entries', KarmaEntrySchema);

module.exports = {
  KarmaEntrySchema,
  KarmaEntryModel
}