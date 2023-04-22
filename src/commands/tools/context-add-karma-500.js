const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { addKarmaPoints } = require("../../modules/karma");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Add 500 karma points").setType(ApplicationCommandType.User),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await addKarmaPoints(500, interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 