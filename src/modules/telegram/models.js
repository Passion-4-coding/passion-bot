const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const TelegramMemberSchema = new mongoose.Schema({
  memberId: {
    type: ObjectId,
    ref: 'members',
    required: true,
  },
  discordId: {
    type: String,
    required: true,
  },
  tgname: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true
  },
  updatedOn: {
    type: Date,
    required: true
  },
});

const TelegramMemberModel = mongoose.model('telegram-members', TelegramMemberSchema);

module.exports = {
  TelegramMemberSchema,
  TelegramMemberModel
}