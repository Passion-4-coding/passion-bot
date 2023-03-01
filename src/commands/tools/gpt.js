const { Configuration, OpenAIApi } = require("openai");
const { getBasicGptOptions, getAnswerLengthValue, getEmbed } = require("../../modules/gpt");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: getBasicGptOptions("gpt", "Ask gpt"),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');
    const optionAnswerLength = interaction.options.get('answer-length');

    await interaction.deferReply({
      fetchReply: true
    })

    let response;

    try {
      response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: option.value,
        temperature: 0.7,
        max_tokens: getAnswerLengthValue(optionAnswerLength),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    } catch (error) {
      console.error(error);
    }

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