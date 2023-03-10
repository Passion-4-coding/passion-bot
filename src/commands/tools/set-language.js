const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { language: languageText } = require("../../modules/messages");
const { roles, languages: languagesRoles } = require("../../constants");
const { getLanguageRole } = require("../../modules/roles");

const languages = {
  ua: "ua",
  en: "en",
  ru: "ru",
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-language")
    .setDescription("Set role language")
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Choose a language')
        .setChoices(
          {name: languages.ua, value: languages.ua},
          {name: languages.en, value: languages.en},
          {name: languages.ru, value: languages.ru},
        ).
        setRequired(true)
      ),
  async execute(interaction) {
    const languageOption = interaction.options.get('language');
    const language = languageOption.value;
    await interaction.deferReply({
      fetchReply: true
    })

    for(const roleName of languagesRoles) {
      interaction.member.roles.remove(roles[roleName]);
    }

    const languageRole = interaction.member.guild.roles.cache.get(roles[language]);
    interaction.member.roles.add(languageRole).catch(console.error);

    const embed = new EmbedBuilder()
      .setDescription(languageText[language])
    
    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })
  }
} 