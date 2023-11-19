const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const StreakEntrySchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  discordMemberId: {
    type: String,
    required: true
  },
  activities: [{
    type: String,
    required: true,
    enum: ["bump", "message", "content-making", "quiz"]
  }],
  completed: {
    type: Boolean,
    default: false
  },
  length: {
    type: Number,
    default: 1
  }
});

const StreakEntryModel = mongoose.model('streak-entries', StreakEntrySchema);

module.exports = {
  StreakEntryModel
}