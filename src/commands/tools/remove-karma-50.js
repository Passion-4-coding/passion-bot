const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { changeKarmaManual } = require("../../modules/karma");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Remove 50 karma points").setType(ApplicationCommandType.User),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await changeKarmaManual(-50, interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 