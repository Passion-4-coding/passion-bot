const { TelegramMemberModel } = require("./models");

const addTelegramMember = async (member) => {
  const newTelegramMember = new TelegramMemberModel(member);
  try {
    return newTelegramMember.save();
  } catch (error) {
    console.error(error);
  }
}
const isExists = (discordId) => {
  return TelegramMemberModel.exists({ discordId });
}

const updateTelegramMember = (id, data) => {
  return TelegramMemberModel.updateOne({ _id: id }, data);
};

const getAllTelegramMembers = () => {
  return TelegramMemberModel.find();
}

module.exports = {
  addTelegramMember,
  isExists,
  updateTelegramMember,
  getAllTelegramMembers
}