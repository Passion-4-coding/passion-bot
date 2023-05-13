const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { getMemberTotalKarma } = require("../../modules/member");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Get user karma").setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await getMemberTotalKarma(interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 