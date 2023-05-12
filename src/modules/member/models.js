const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  karma: {
    type: Number,
    default: 0
  },
  isBot: Boolean,
  isActive: Boolean,
  isTest: Boolean
});

const MemberModel = mongoose.model('members', MemberSchema);

module.exports = {
  MemberSchema,
  MemberModel
}