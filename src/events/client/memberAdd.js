const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");


module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const role = member.guild.roles.cache.get("850393978926006294");
    member.roles.add(role).catch(console.error);

    const channel = client.channels.cache.get("876024439245000746");
    const randomLanguage = languages[Math.floor(Math.random()*languages.length)];
    const randomMessage = welcome.messages[randomLanguage][Math.floor(Math.random()*welcome.messages[randomLanguage].length)];
    const otherLanguages = languages.filter(l => l !== randomLanguage);
    const languageRole = interaction.guild.roles.cache.get(languageRoles[randomLanguage]);
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
  
    await channel.send({ content: `${member}\n${randomMessage}`, components: [buttons] });
  }
}