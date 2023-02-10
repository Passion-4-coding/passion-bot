const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const { Translator } = require('deepl-node');

const translator = new Translator(process.env.DEEPL_KEY);

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deep-gpt")
    .setDescription("Ask gpt")
    .addStringOption(option =>
      option.setName('question')
          .setDescription('Question to ask')
          .setRequired(true)),
  async execute(interaction) {
    const option = interaction.options.get('question');

    await interaction.deferReply({
      fetchReply: true
    })

    const question = await translator.translateText(option.value, null, 'en-US');

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question.text,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const ruAnswer = await translator.translateText(response.data.choices[0].text, null, 'ru');

    await interaction.editReply({
      content: `You asked: ${option.value}. \nThe answer is: ${ruAnswer.text}`
    })
  }
    
} 