const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { languages, languageRoles } = require("../../modules/messages");


module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    console.log("member", member)
    const role = member.guild.roles.cache.get("850393978926006294");
    member.roles.add(role).catch(console.error);
    console.log("member.guild.channels", member.guild.channels)
    const channel = member.guild.channels.cache.get("876024439245000746");
    console.log("channel", channel)
    const randomLanguage = languages[Math.floor(Math.random()*languages.length)];
    console.log("randomLanguage", randomLanguage)
    const randomMessage = welcome.messages[randomLanguage][Math.floor(Math.random()*welcome.messages[randomLanguage].length)];
    console.log("randomMessage", randomMessage)
    const otherLanguages = languages.filter(l => l !== randomLanguage);
    console.log("otherLanguages", otherLanguages)
    const languageRole = interaction.guild.roles.cache.get(languageRoles[randomLanguage]);
    console.log("languageRole", languageRole)
    interaction.member.roles.add(languageRole).catch(console.error);

    const buttons = new ActionRowBuilder()
    for(const language of otherLanguages) {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`${languageRoles[randomLanguage]}:${language}:${interaction.member.id}`)
          .setLabel(welcome.buttons[language])
          .setStyle(ButtonStyle.Primary),
      );
    }
    console.log("buttons", buttons)
    await channel.send({ content: `${member}\n${randomMessage}`, components: [buttons] });
  }
}