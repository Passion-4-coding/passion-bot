const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
        .setRequired(true))
    .addStringOption(option =>
      option.setName('answer-type')
        .setDescription('Choose a method how do you want to receive answer. Default: Reply')
        .setChoices(
          {name: "Reply", value: "reply"}, 
          {name: "Private", value: "private"},
        )
      ),
  async execute(interaction) {
    const option = interaction.options.get('question');
    const optionAnswerType = interaction.options.get('answer-type');

    await interaction.deferReply({
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

    const isPrivate = optionAnswerType && optionAnswerType.value === "private";

    if (isPrivate) {
      interaction.member.send(response.data.choices[0].text);
    }

    const embed = isPrivate ? (
      new EmbedBuilder()
      .setDescription("Answer to your question has been sent as a private message")
      ) : (
      new EmbedBuilder()
      .setTitle(option.value)
      .setDescription(response.data.choices[0].text)
    )

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
    
} 