const { SlashCommandBuilder } = require("discord.js");
const { getMemberTotalKarma } = require("../../modules/member");

module.exports = {
  data: new SlashCommandBuilder().setName("my-karma").setDescription("Show my karma points"),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
    })

    const embed = await getMemberTotalKarma(interaction.member);

    await interaction.editReply({
      embeds: [embed]
    })
  }
} 