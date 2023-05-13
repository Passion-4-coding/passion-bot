const { EmbedBuilder, MessageType } = require("discord.js");
const NodeCache = require( "node-cache" );
const { addStatEntry } = require("./services");
const { getMemberByDiscordId } = require("../member");

const memberMessagesCache = new NodeCache( { stdTTL: 90000 } );

const addEntryWithDiscordMember = async (discordMemberId, data) => {
  const member = await getMemberByDiscordId(discordMemberId);
  return addStatEntry({ memberId: member._id, ...data });
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

module.exports = {
  addStatEntryMemberAdd,
  addStatEntryMemberRemove,
  addStatEntryMemberBanned,
  handleStatsForMessage
}