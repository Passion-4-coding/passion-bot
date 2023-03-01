const { getBasicGptOptions, getEmbed, getAnswer } = require("../../modules/gpt");

module.exports = {
  data: getBasicGptOptions("gpt", "Ask gpt"),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');

    await interaction.deferReply({
      fetchReply: true
    })

    const response = await getAnswer(option.value);

    const isPrivate = optionAnswerType && optionAnswerType.value === "private";

    if (isPrivate) {
      interaction.member.send(response.data.choices[0].text);
    }

    const embed = getEmbed(isPrivate, option.value, response.data.choices[0].text);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
} 