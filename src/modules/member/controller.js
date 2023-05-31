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
const { roles, karmaGradation, progressRoles } = require("../../constants");

const { GUILD_ID } = process.env;

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
    isBot: discordMember.bot,
    isTest: false,
  }
  return addMember(member);
};
const _removeMember = (discordMember) => removeMember(discordMember);

const getMemberTotalKarma = async (user) => {
  try {
    const karma = await getMemberKarma(user.id);
    return new EmbedBuilder().setDescription(`User ${user.username} has ${karma} karma points`);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setDescription(`Error getting karma for user ${user.username}`);
  }
}

const promoteRole = async (member, discordMembers, addStatEntryMemberPromoted) => {
  const discordMember = discordMembers.find(m => {
    return m.id === member.discordId
  });
  if (!discordMember) return;
  let memberProgressRole;
  discordMember.roles.cache.forEach(role => {
    const progressRole = progressRoles.find(r => r.id === role.id);
    if (progressRole) memberProgressRole = progressRole;
  });
  let newMemberRoleId = roles.trainee;
  if (member.karma >= karmaGradation.JUNIOR_ROLE) {
    newMemberRoleId = roles.junior;
  }
  if (member.karma >= karmaGradation.MIDDLE_ROLE) {
    newMemberRoleId = roles.middle;
  }
  if (member.karma >= karmaGradation.SENIOR_ROLE) {
    newMemberRoleId = roles.senior;
  }
  if (member.karma >= karmaGradation.PRINCIPAL_ROLE) {
    newMemberRoleId = roles.principal;
  }
  if (!memberProgressRole) {
    discordMember.roles.add(newMemberRoleId);
    await addStatEntryMemberPromoted(member.discordId);
    return;
  }
  if (memberProgressRole.id === newMemberRoleId) {
    return;
  }
  discordMember.roles.remove(memberProgressRole.id);
  discordMember.roles.add(newMemberRoleId);
  await addStatEntryMemberPromoted(member.discordId);
}

// returns amount of promoted users
const updateRoles = async (client, addStatEntryMemberPromoted) => {
  const members = await _getAllMembers();
  const guild = client.guilds.resolve(GUILD_ID);
  const discordMembers = await guild.members.fetch();
  let count = 0;
  for (let index = 0; index < members.length; index++) {
    const member = members[index];
    let status = await promoteRole(member, discordMembers, addStatEntryMemberPromoted);
    if (status) count += 1;
  }
  return count;
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
  updateRoles
}
