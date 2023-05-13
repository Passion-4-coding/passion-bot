const { EmbedBuilder } = require("discord.js");
const {
  getMembersCount,
  getMemberByDiscordId,
  getMemberById,
  addMember,
  getMemberKarma,
  updateMemberKarma,
  getAllMembers,
  removeMember
} = require("./services");

const handleMemberApi = (app) => {
  app.get('/api/member-count', async (req, res) => {
    const count = await getMembersCount();
    res.send(count.toString());
  })
}

const _getMemberById = (memberId) => getMemberById(memberId);
const _getMemberByDiscordId = (memberId) => getMemberByDiscordId(memberId);
const _getAllMembers = () => getAllMembers();

const _addMember = (discordMember) => {
  const member = {
    discordId: discordMember.id,
    username: discordMember.username,
    isActive: true,
    isBot: discordMember.user ? discordMember.user.bot : false,
    isTest: false,
  }
  return addMember(member);
};
const _removeMember = (discordMember) => removeMember(discordMember);

const getMemberTotalKarma = async (user) => {
  console.log("user", user);
  try {
    const karma = await getMemberKarma(user.id);
    return new EmbedBuilder().setDescription(`User ${user.username} has ${karma} karma points`);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setDescription(`Error getting karma for user ${user.username}`);
  }
}

const updateMemberTotalKarma = async (memberId, karma) => updateMemberKarma(memberId, karma);

module.exports = {
  handleMemberApi,
  getMemberById: _getMemberById,
  getMemberByDiscordId: _getMemberByDiscordId,
  addMember: _addMember,
  removeMember: _removeMember,
  getMemberTotalKarma,
  updateMemberTotalKarma,
  getAllMembers: _getAllMembers,
}
