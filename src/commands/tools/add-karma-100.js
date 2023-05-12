const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { changeKarmaManual } = require("../../modules/karma");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Add 100 karma points").setType(ApplicationCommandType.User),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await changeKarmaManual(100, interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 