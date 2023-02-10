const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Translator } = require('deepl-node');

const translator = new Translator(process.env.DEEPL_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate-to-ru")
    .setDescription("Translate your text from English to Russian")
    .addStringOption(option =>
      option.setName('text')
          .setDescription('Text to translate')
          .setRequired(true)),
  async execute(interaction) {
    const option = interaction.options.get('text');

    await interaction.deferReply({
      fetchReply: true
    })

    const result = await translator.translateText(option.value, null, 'ru');

    const embed = new EmbedBuilder()
      .setTitle(option.value)
      .setDescription(result.text);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
    
} 