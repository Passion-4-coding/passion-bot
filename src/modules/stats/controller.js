const { subDays } = require("date-fns");
const { EmbedBuilder, MessageType } = require("discord.js");
const NodeCache = require( "node-cache" );
const { addStatEntry, getStatEntriesForTimeRange } = require("./services");
const { calculateMessages } = require("./utils");
const { getMemberByDiscordId } = require("../member");
const { getKarmaForThePastDay } = require("../karma");
const { colors, images } = require("../../constants");

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
      `**${messageCount}** повідомлен${messageCount === 1 ? 'ня' : 'ь'} було відправлено.\n` +
      `**${commands}** команд${commands === 1 ? 'а' : ''} була використана.\n` +
      `**${membersJoined}** користувач${membersJoined === 1 ? '' : 'ів'} зайшло та **${membersLeft}** користувач${membersLeft === 1 ? '' : 'ів'} вийшло.\n` +
      `**${membersPromoted}** користувач${membersPromoted === 1 ? '' : 's'} було підвищено\n` +
      `**${bumps}** бамп${bumps === 1 ? '' : 'ів'} було використано для підвищення популярності нашої спільноти.\n` +
      `**${totalKarma}** очок карми було зароблено нашою спільнотою.`;
    return new EmbedBuilder().setColor(colors.primary).setDescription(text).setImage(images.stats);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Щось пішло не так з виведенням денної статистики`);
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