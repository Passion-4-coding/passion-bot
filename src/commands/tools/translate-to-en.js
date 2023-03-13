const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Translator } = require('deepl-node');

const translator = new Translator(process.env.DEEPL_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate-to-en")
    .setDescription("Translate your text from Russian to English")
    .addStringOption(option =>
      option.setName('text')
          .setDescription('Text to translate')
          .setRequired(true)),
  async execute(interaction) {
    const option = interaction.options.get('text');

    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true
    })

    const result = await translator.translateText(option.value, null, 'en-US');

    const embed = new EmbedBuilder()
      .setTitle(option.value)
      .setDescription(result.text);

    await interaction.editReply({
      embeds: [embed]
    })
  }
    
} 