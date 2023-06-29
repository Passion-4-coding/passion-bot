const { subDays } = require("date-fns");
const { EmbedBuilder, MessageType } = require("discord.js");
const NodeCache = require( "node-cache" );
const { addStatEntry, getStatEntriesForTimeRange } = require("./services");
const { calculateMessages } = require("./utils");
const { getMemberByDiscordId } = require("../member");
const { getKarmaForThePastDay } = require("../karma");
const { colors } = require("../../constants");

const memberMessagesCache = new NodeCache( { stdTTL: 90000 } );

const addEntryWithDiscordMember = async (discordMemberId, data) => {
  try {
    const member = await getMemberByDiscordId(discordMemberId);
    if (!member) return;
    await addStatEntry({ memberId: member._id, ...data });
  } catch (error) {
    console.error(error);
  }
}

const addStatEntryMessage = async () => {
  const messageCount = memberMessagesCache.get("message-count") || 0;
  const updatedMessageCount = messageCount + 1;
  if (updatedMessageCount >= 10) {
    memberMessagesCache.del("message-count");
    return addStatEntry({ type: "message", amount: updatedMessageCount });
  }
  memberMessagesCache.set("message-count", updatedMessageCount);
}

const addStatEntryMemberAdd = (discordMemberId) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "member-add", amount: 1 });
}

const addStatEntryMemberRemove = (discordMemberId) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "member-remove", amount: 1 });
}

const addStatEntryMemberBanned = (discordMemberId) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "member-banned", amount: 1 });
}

const addStatEntryMemberCommandUse = (discordMemberId, command) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "command-use", amount: 1, action: command });
}

const addStatEntryMemberBump = (discordMemberId) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "bump", amount: 1 });
}

const addStatEntryMemberPromoted = (discordMemberId) => {
  return addEntryWithDiscordMember(discordMemberId, { type: "promotion", amount: 1 });
}

const handleStatsForMessage = async (interaction) => {
  addStatEntryMessage();
  if (interaction.type !== MessageType.ChatInputCommand) return;
  addStatEntryMemberCommandUse(interaction.interaction.user.id, interaction.interaction.commandName);
  if (interaction.interaction.commandName !== "bump") return;
  for (let embed of interaction.embeds) {
    if (embed.description.includes("Bump done!") || embed.description.includes("Server bumped")) {
      await addStatEntryMemberBump(interaction.interaction.user.id);
    }
  }
}

const getPastDayStats = async () => {
  const end = new Date();
  const start = subDays(end, 1);
  try {
    const entries = await getStatEntriesForTimeRange(start, end);
    const messageCount = calculateMessages(entries);
    const bumps = entries.filter(e => e.type === "bump").length;
    const bans = entries.filter(e => e.type === "member-banned").length;
    const commands = entries.filter(e => e.type === "command-use").length;
    const membersJoined = entries.filter(e => e.type === "member-add").length;
    const membersLeft = entries.filter(e => e.type === "member-remove").length;
    const membersPromoted = entries.filter(e => e.type === "promotion").length;
    const totalKarma = await getKarmaForThePastDay();
    const text = 
      `**${messageCount}** message${messageCount === 1 ? '' : 's'} was sent.\n` +
      `**${commands}** command${commands === 1 ? '' : 's'} was used.\n` +
      `**${membersJoined}** member${membersJoined === 1 ? '' : 's'} joined and **${membersLeft}** member${membersLeft === 1 ? '' : 's'} left.\n` +
      `**${membersPromoted}** member${membersPromoted === 1 ? '' : 's'} promoted\n` +
      `**${bans}** member${bans === 1 ? '' : 's'} was banned.\n` +
      `**${bumps}** bump${bumps === 1 ? '' : 's'} was made to promote our server.\n` +
      `**${totalKarma}** total karma point${totalKarma === 1 ? '' : 's'} was earned by our community.`;
    return new EmbedBuilder().setColor(colors.primary).setDescription(text).setImage("https://res.cloudinary.com/de76u6w6i/image/upload/v1687944284/stats_gzoulf.png");
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Something went wrong with getting data for leader board`);
  }
}

module.exports = {
  addStatEntryMemberAdd,
  addStatEntryMemberRemove,
  addStatEntryMemberBanned,
  handleStatsForMessage,
  getPastDayStats,
  addStatEntryMemberPromoted
}