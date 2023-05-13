const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  karma: {
    type: Number,
    default: 0
  },
  isBot: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isTest: {
    type: Boolean,
    required: true,
  }
});

const MemberModel = mongoose.model('members', MemberSchema);

module.exports = {
  MemberSchema,
  MemberModel
}