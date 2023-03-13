const { getBasicGptOptions, getEmbed, getAnswer } = require("../../modules/gpt");

module.exports = {
  data: getBasicGptOptions("gpt", "Ask gpt"),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');

    const isPrivate = optionAnswerType && optionAnswerType.value === "private";

    await interaction.deferReply({
      fetchReply: true,
      ephemeral: isPrivate,
    })

    const answer = await getAnswer(option.value);

    if (isPrivate) {
      interaction.member.send(answer);
    }

    const embed = getEmbed(isPrivate, option.value, answer, interaction.member);

    await interaction.editReply({
      embeds: [embed]
    })
  }
} 