const { MemberModel } = require("./models");

const getMemberByDiscordId = async (memberDiscordId) => {
  const member = await MemberModel.findOne({ discordId: memberDiscordId }).exec();
  return member;
}

const getMemberById = async (memberId) => {
  const member = await MemberModel.findById(memberId).exec();
  return member;
}

const addMember = async (discordMember) => {
  const exist = await MemberModel.exists({ discordId: discordMember.id });
  if (exist) return;
  const newMember = new MemberModel({ discordId: member.id, username: member.username });
  try {
    newMember.save();
  } catch (error) {
    console.error(error);
  }
}

const updateMembers = (discordId, isBot) => {
  MemberModel.updateOne({ discordId }, [
    {"$set": { isTest: true, isBot, isActive: true } }
  ]).then(() => {
  }).catch(error => {
    console.log(error);
  });
};

const getMemberKarma = async (discordMemberId) => {
  const member = await MemberModel.findOne({ discordId: discordMemberId }).exec();
  return member.karma;
}

const updateMemberKarma = (memberId, karma) => {
  return MemberModel.updateOne(
    { _id: memberId },
    { $inc: { karma } }
  )
}

const getMembersCount = () => {
  return MemberModel.countDocuments();
}

const getAllMembers = () => {
  return MemberModel.find();
}

module.exports = {
  getMemberByDiscordId,
  getMemberById,
  addMember,
  getMembersCount,
  getMemberKarma,
  updateMemberKarma,
  updateMembers,
  getAllMembers
}