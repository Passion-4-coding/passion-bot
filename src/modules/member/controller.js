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
  getMembers,
  updateMember,
  getMembersForSearch
} = require("./services");
const { roles, karmaGradation, progressRoles, colors } = require("../../constants");
const { scopes, validateAccess } = require("../auth");
const { logMemberRoleChange } = require("../log");

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
  app.get('/api/members/search', async ({ headers, query }, res) => {
    if (!await validateAccess(headers, scopes.user, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see members"});
      return;
    }
    const response = await getMembersForSearch(query.search);
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

const syncMembers = async (guildMembers) => {
  const dbMembers = await getAllMembers();
  for (let index = 0; index < dbMembers.length; index++) {
    const dbMember = dbMembers[index];
    const guildMember = guildMembers.find(guildMember => {
      return guildMember.id === dbMember.discordId;
    });
    await updateMember(dbMember._id, {
      isActive: guildMember,
      username: guildMember ? guildMember.username : dbMember.username,
      avatar: guildMember ? `https://cdn.discordapp.com/avatars/${guildMember.user.id}/${guildMember.user.avatar}.png?size=256` : dbMember.avatar
    });
    console.log(`member ${dbMember.username} updated`)
  }
}

const getMemberTotalKarma = async (user) => {
  try {
    const karma = await getMemberKarma(user.id);
    const gradationValue = Object.values(karmaGradation).find(value => value >= karma);
    const gradationRole = Object.keys(karmaGradation).find(key => karmaGradation[key] >= karma);
    if (gradationValue && gradationRole && user.roles && !user.roles.cache.has(roles.qa)) {
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
  return roleId === roles.architect || roleId === roles.qa || roleId === roles.owner
}

const promoteRole = async (member, client, addStatEntryMemberPromoted) => {
  const guild = client.guilds.resolve(GUILD_ID);
  const discordMembers = await guild.members.fetch();

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
  let newRole = "trainee";
  if (member.karma >= karmaGradation.junior) {
    newMemberRoleId = roles.junior;
    newRole = "junior";
  }
  if (member.karma >= karmaGradation.middle) {
    newMemberRoleId = roles.middle;
    newRole = "middle";
  }
  if (member.karma >= karmaGradation.senior) {
    newMemberRoleId = roles.senior;
    newRole = "senior";
  }
  if (member.karma >= karmaGradation.principal) {
    newMemberRoleId = roles.principal;
    newRole = "principal";
  }
  if (member.karma >= karmaGradation.lead) {
    newMemberRoleId = roles.lead;
    newRole = "lead";
  }
  if (!memberProgressRole) {
    discordMember.roles.add(newMemberRoleId);
    await addStatEntryMemberPromoted(member.discordId);
    return;
  }
  if (memberProgressRole.id === newMemberRoleId || isManualRole(memberProgressRole.id)) {
    return;
  }
  await discordMember.roles.remove(memberProgressRole.id);
  await discordMember.roles.add(newMemberRoleId);
  logMemberRoleChange(guild, discordMember, memberProgressRole.name, newRole);
  await addStatEntryMemberPromoted(member.discordId);
}

// returns amount of promoted users
const updateRoles = async (client, addStatEntryMemberPromoted) => {
  const members = await _getAllMembers();
  let count = 0;
  for (let index = 0; index < members.length; index++) {
    const member = members[index];
    let status = await promoteRole(member, client, addStatEntryMemberPromoted);
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
  updateRoles,
  syncMembers,
  promoteRole
}
