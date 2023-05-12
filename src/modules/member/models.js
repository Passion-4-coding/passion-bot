const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  discordId: String,
  username: String,
  karma: {
    type: Number,
    default: 0
  }
});

const MemberModel = mongoose.model('members', MemberSchema);

module.exports = {
  MemberSchema,
  MemberModel
}