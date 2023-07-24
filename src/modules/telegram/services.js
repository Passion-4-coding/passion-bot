const { getPaginatedDataFromModel } = require("../../utils");
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
  return TelegramMemberModel.findByIdAndUpdate(id, data, { new: true }).populate("memberId");
};

const getAllTelegramMembers = (params) => {
  const { page = 1, pageSize = 10 } = params;
  return getPaginatedDataFromModel(TelegramMemberModel, page, pageSize, {}, true);
}

module.exports = {
  addTelegramMember,
  isExists,
  updateTelegramMember,
  getAllTelegramMembers
}