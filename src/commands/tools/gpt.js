const { getBasicGptOptions, getEmbed, getAnswer } = require("../../modules/gpt");

module.exports = {
  data: getBasicGptOptions("gpt", "Ask gpt"),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');

    await interaction.deferReply({
      fetchReply: true
    })

    const answer = await getAnswer(option.value);

    const isPrivate = optionAnswerType && optionAnswerType.value === "private";

    if (isPrivate) {
      interaction.member.send(answer);
    }

    const embed = getEmbed(isPrivate, option.value, answer, interaction.member);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
} 