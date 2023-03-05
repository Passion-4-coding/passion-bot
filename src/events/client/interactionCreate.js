const { welcome } = require("../../modules/messages");
const { roles, languages } = require("../../constants")
const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const ids = interaction.customId.split(":");
      const currentLanguage = ids[1];
      const memberId = ids[2];
      if (memberId !== interaction.member.id) return;
      const randomMessage = welcome.messages[currentLanguage][Math.floor(Math.random()*welcome.messages[currentLanguage].length)];
      for(const roleName of languages) {
        interaction.member.roles.remove(roles[roleName]);
      }
      interaction.member.roles.add(roles[currentLanguage]);

      const otherLanguages = languages.filter(l => l !== currentLanguage);
      const buttons = new ActionRowBuilder()
      for(const language of otherLanguages) {
        buttons.addComponents(
          new ButtonBuilder()
            .setCustomId(`${roles[language]}:${language}:${interaction.member.id}`)
            .setLabel(welcome.buttons[language])
            .setStyle(ButtonStyle.Primary),
        );
      }
      interaction.update({ content: `${interaction.member}\n${randomMessage}\n\n${welcome.replies[currentLanguage]}`, components: [buttons] });
      return;
    }
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Something went wrong with executing this command...",
          ephemeral: true
        })
      }
    }
  }
}