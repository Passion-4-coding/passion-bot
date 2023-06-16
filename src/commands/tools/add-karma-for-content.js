const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { changeKarmaManual, addKarmaForContentMaking } = require("../../modules/karma");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Add 50 karma points for content").setType(ApplicationCommandType.User),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await addKarmaForContentMaking(interaction.targetUser);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 