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
      )
    .addStringOption(option =>
      option.setName('quantity')
        .setDescription('Images quantity. Default: 1')
        .setChoices(
          {name: "1", value: "1"}, 
          {name: "2", value: "2"},
          {name: "3", value: "3"},
          {name: "4", value: "4"}
        )
      ),
  async execute(interaction) {
    const optionDescription = interaction.options.get('description');
    const optionSize = interaction.options.get('size');
    const optionNumber = interaction.options.get('quantity');

    await interaction.deferReply({
      fetchReply: true
    })

    const size = optionSize ? optionSize.value : "256x256";
    const number = optionNumber ? Number(optionNumber.value) : 1;

    const response = await openai.createImage({
      prompt: optionDescription.value,
      n: number,
      size: size,
    });

    const embed = new EmbedBuilder()
      .setTitle(`Size: ${size}\nNumber: ${size}`)
      .setDescription(optionDescription.value)

      
    images = response.data.data;
      
    const imagesEmbeds = images.map(image => {
      return new EmbedBuilder().setImage(image.url);
    })
    
    await interaction.editReply({
      ephemeral: true,
      embeds: [embed, ...imagesEmbeds]
    })
  }
} 