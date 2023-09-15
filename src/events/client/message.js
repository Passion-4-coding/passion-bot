const { Events } = require("discord.js");
const { addKarmaForMessageActivity, addKarmaForBump, removeKarmaForSwearWord } = require("../../modules/karma");
const { getSwearWordAmount, checkSwearWordsForUser } = require("../../modules/swear");
const { handleStatsForMessage } = require("../../modules/stats");
const { channels, roles } = require("../../constants");
const { handleDraftMessage } = require("../../modules/content-making");
const { logInviteLinkPublished } = require("../../modules/log");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(interaction, client) {
    if (interaction.channelId === channels.draft  && !interaction.member.roles.cache.has(roles.owner)) {
      handleDraftMessage(interaction, client)
    } 
    const message = interaction.content;
    const channelId = interaction.channelId;

    if (message.includes('discord.gg/'||'discordapp.com/invite/') && interaction.channelId !== channels.log) {
      interaction.delete();
      const muteTime = 180 * 60 * 1000;
      interaction.member.timeout(muteTime);
      logInviteLinkPublished(client, interaction.member, message);
      return;
    }

    // check for bump and add karma
    addKarmaForBump(client, interaction);
    
    // handle message stats
    handleStatsForMessage(interaction);
    
    if (!interaction.member) return;

    const memberId = interaction.member.user.id;

    if (interaction.author.bot) return;
    // add karma for user activity
    await addKarmaForMessageActivity(client, message, memberId, channelId);

    const swearWordsAmount = getSwearWordAmount(message);

    if (swearWordsAmount > 0) {
      const channel = client.channels.cache.get(interaction.channelId);
      checkSwearWordsForUser(swearWordsAmount, interaction.member, channel);
      await removeKarmaForSwearWord(client, memberId, message);
    }
  } 
}