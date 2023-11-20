const { SlashCommandBuilder } = require("discord.js");
const { getCurrentStreakEmbed } = require("../../modules/streak");

module.exports = {
  data: new SlashCommandBuilder().setName("streak").setDescription("Get karma streak information"),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
    })

    const embed = await getCurrentStreakEmbed(interaction.member.id, client);

    await interaction.editReply({
      embeds: [embed]
    })
  }
} 