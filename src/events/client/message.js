const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(interaction, client) {
    if (interaction.author.bot) return;
    client.emit('guildMemberAdd', interaction.member);
  }
  
}