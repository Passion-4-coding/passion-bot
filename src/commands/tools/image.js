const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image")
    .setDescription("Draw an image")
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Describe the image you want ai draw for you')
        .setRequired(true)
      )
    .addStringOption(option =>
      option.setName('size')
        .setDescription('Image size. Default: SM')
        .setChoices(
          {name: "SM(256x256)", value: "256x256"}, 
          {name: "MD(512x512)", value: "512x512"},
          {name: "LG(1024x1024)", value: "1024x1024"}
        )
      ),
  async execute(interaction) {
    const optionDescription = interaction.options.get('description');
    const optionSize = interaction.options.get('size');

    await interaction.deferReply({
      fetchReply: true
    })

    const size = optionSize ? optionSize.value : "256x256";

    const response = await openai.createImage({
      prompt: optionDescription.value,
      n: 1,
      size: size,
    });

    image_url = response.data.data[0].url;

    const embed = new EmbedBuilder()
      .setTitle(`Description: ${optionDescription.value}\nSize: ${size}`)
      .setDescription(image_url);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
    
} 