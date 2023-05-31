const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const StatsEntrySchema = new mongoose.Schema({
  memberId: {
    type: ObjectId,
    ref: 'members',
    required: function() {
      return this.type !== "message";
    }
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["message", "bump", "member-add", "member-remove", "member-banned", "command-use", "promotion"]
  },
  amount: {
    type: Number,
    default: 1
  },
  action: {
    type: String,
    required: function() {
      return this.type === "command-use";
    }
  },
});

const StatsEntryModel = mongoose.model('stat-entries', StatsEntrySchema);

module.exports = {
  StatsEntrySchema,
  StatsEntryModel
}