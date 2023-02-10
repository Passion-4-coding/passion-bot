const { SlashCommandBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gpt")
    .setDescription("Ask gpt")
    .addStringOption(option =>
      option.setName('question')
          .setDescription('Question to ask')
          .setRequired(true)),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const message = await interaction.deferReply({
      fetchReply: true
    })

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: option.value,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    await interaction.editReply({
      content: `You asked: ${option.value}. \n The answer is: ${response.data.choices[0].text}`
    })
  }
    
} 