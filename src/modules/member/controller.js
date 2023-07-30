const { EmbedBuilder } = require("discord.js");
const {
  getMembersCount,
  getMemberByDiscordId,
  getMemberById,
  addMember,
  getMemberKarma,
  updateMemberKarma,
  getAllMembers,
  removeMember,
  getMembers
} = require("./services");
const { roles, karmaGradation, progressRoles, colors } = require("../../constants");
const { scopes, validateAccess } = require("../auth");

const { GUILD_ID } = process.env;

const handleMemberApi = (app, client) => {
  app.get('/api/member-count', async (req, res) => {
    const count = await getMembersCount();
    res.send(count.toString());
  })
  app.get('/api/members', async ({ headers, query }, res) => {
    if (!await validateAccess(headers, scopes.user, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see members"});
      return;
    }
    const response = await getMembers(query);
    res.send(response);
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
    const gradationValue = Object.values(karmaGradation).find(value => value >= karma);
    const gradationRole = Object.keys(karmaGradation).find(key => karmaGradation[key] >= karma);
    if (gradationValue && gradationRole && user.roles && !user.roles.cache.has(roles.lead)) {
      const karmaNeededForNextRole = Math.round(gradationValue - karma);
      return new EmbedBuilder().setColor(colors.primary).setDescription(`Ти маєш ${karma} очок карми. До наступної ролі ${gradationRole} тобі треба заробити ще ${karmaNeededForNextRole} карми`);
    }
    return new EmbedBuilder().setColor(colors.primary).setDescription(`У тебе ${karma} очок карми.`);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Помилка при отриманні кількості очок карми для користувача з ніком ${user.username}`);
  }
}

const isManualRole = (roleId) => {
  return roleId === roles.architect || roleId === roles.lead || roleId === roles.owner
}

const promoteRole = async (member, discordMembers, addStatEntryMemberPromoted) => {
  const discordMember = discordMembers.find(m => {
    return m.id === member.discordId
  });
  if (!discordMember || member.isBot || !member.isActive || member.isNew) return;
  let memberProgressRole;
  discordMember.roles.cache.forEach(role => {
    const progressRole = progressRoles.find(r => r.id === role.id);
    if (progressRole) memberProgressRole = progressRole;
  });
  let newMemberRoleId = roles.trainee;
  if (member.karma >= karmaGradation.junior) {
    newMemberRoleId = roles.junior;
  }
  if (member.karma >= karmaGradation.middle) {
    newMemberRoleId = roles.middle;
  }
  if (member.karma >= karmaGradation.senior) {
    newMemberRoleId = roles.senior;
  }
  if (member.karma >= karmaGradation.principal) {
    newMemberRoleId = roles.principal;
  }
  if (!memberProgressRole) {
    discordMember.roles.add(newMemberRoleId);
    await addStatEntryMemberPromoted(member.discordId);
    return;
  }
  if (memberProgressRole.id === newMemberRoleId || isManualRole(memberProgressRole.id)) {
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
