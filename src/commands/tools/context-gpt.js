const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { getEmbed, getAnswer } = require("../../modules/gpt");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Ask gpt").setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
    })

    const answer = await getAnswer(interaction.targetMessage.content);

    const embed = getEmbed(false, interaction.targetMessage.content, answer, interaction.member);

    await interaction.editReply({
      embeds: [embed]
    })
  }
} 