const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const { Translator } = require('deepl-node');
const { getBasicGptOptions, getAnswerLengthValue, getEmbed } = require("../../modules/gpt");

const translator = new Translator(process.env.DEEPL_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: getBasicGptOptions("deep-gpt", "Ask gpt (for Russian language only)"),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');
    const optionAnswerLength = interaction.options.get('answer-length');

    await interaction.deferReply({
      fetchReply: true
    })

    const question = await translator.translateText(option.value, null, 'en-US');

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question.text,
      temperature: 0.7,
      max_tokens: getAnswerLengthValue(optionAnswerLength),
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const isPrivate = optionAnswerType && optionAnswerType.value === "private";

    if (isPrivate) {
      interaction.member.send(response.data.choices[0].text);
    }

    const ruAnswer = await translator.translateText(response.data.choices[0].text, null, 'ru');

    const embed = getEmbed(isPrivate, option.value, ruAnswer.text);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
    
} 