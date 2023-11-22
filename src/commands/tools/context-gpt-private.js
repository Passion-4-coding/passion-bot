const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { getEmbed, getAnswer } = require("../../modules/gpt");

module.exports = {
  data: new ContextMenuCommandBuilder().setName("Ask gpt in private").setType(ApplicationCommandType.Message),
  async execute(interaction) {
    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const answer = await getAnswer(interaction.targetMessage.content, interaction.member.id);
    
    interaction.member.send(answer);

    const embed = getEmbed(true, interaction.targetMessage.content, answer, interaction.member);

    await interaction.editReply({
      embeds: [embed]
    })
  }
} 