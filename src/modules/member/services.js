const { MemberModel } = require("./models");

const getMemberByDiscordId = async (memberDiscordId) => {
  const member = await MemberModel.findOne({ discordId: memberDiscordId }).exec();
  return member;
}

const getMemberById = async (memberId) => {
  const member = await MemberModel.findById(memberId).exec();
  return member;
}

const addMember = async (member) => {
  const exist = await MemberModel.exists({ discordId: member.discordId });
  if (exist) return;
  const newMember = new MemberModel(member);
  try {
    newMember.save();
  } catch (error) {
    console.error(error);
  }
}

const removeMember = async (discordMember) => {
  return MemberModel.updateOne({ discordId: discordMember.id }, { isActive: false });
}

const updateMembers = async (member) => {
  const dbmember = await getMemberByDiscordId(member.id);
  if (!dbmember) {
    await addMember(member);
  }
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