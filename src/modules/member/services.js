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

const removeMember = async (discordMember) => {
  return MemberModel.updateOne({ discordId: discordMember.id }, { isActive: false });
}

const updateMembers = (discordId, isBot) => {
  MemberModel.updateOne({ discordId }, [
    {"$set": { isTest: false, isBot, isActive: true } }
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
  return MemberModel.countDocuments({ isActive: true, isBot: false, isTest: false });
}

const getAllMembers = () => {
  return MemberModel.find();
}

module.exports = {
  getMemberByDiscordId,
  getMemberById,
  addMember,
  removeMember,
  getMembersCount,
  getMemberKarma,
  updateMemberKarma,
  updateMembers,
  getAllMembers
}