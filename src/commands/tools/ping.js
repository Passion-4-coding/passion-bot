const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Return my ping"),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true
    })

    const reply = `API Latency: ${client.ws.ping}\n Client ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
    await interaction.editReply({
      content: reply
    })
  }
    
} 