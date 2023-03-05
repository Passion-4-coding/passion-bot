const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { welcome } = require("../../modules/messages");
const { roles, channels, languages } = require("../../constants");


module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const role = member.guild.roles.cache.get(roles.trainee);
    member.roles.add(role).catch(console.error);
    const channel = member.guild.channels.cache.get(channels.reception);
    const randomLanguage = languages[Math.floor(Math.random()*languages.length)];
    const randomMessage = welcome.messages[randomLanguage][Math.floor(Math.random()*welcome.messages[randomLanguage].length)];
    const otherLanguages = languages.filter(l => l !== randomLanguage);
    const languageRole = member.guild.roles.cache.get(roles[randomLanguage]);
    member.roles.add(languageRole).catch(console.error);

    const buttons = new ActionRowBuilder()
    for(const language of otherLanguages) {
      buttons.addComponents(
        new ButtonBuilder()
          .setCustomId(`${roles[randomLanguage]}:${language}:${member.id}`)
          .setLabel(welcome.buttons[language])
          .setStyle(ButtonStyle.Primary),
      );
    }
    await channel.send({ content: `${member}\n${randomMessage}`, components: [buttons] });
  }
}