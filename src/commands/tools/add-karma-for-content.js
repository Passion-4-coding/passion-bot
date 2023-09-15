const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { addKarmaForContentMaking } = require("../../modules/karma");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Add 50 karma points for content").setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const embed = await addKarmaForContentMaking(client, interaction.targetUser.id, 50);
    
    await interaction.editReply({
      embeds: [embed]
    })
  }
} 