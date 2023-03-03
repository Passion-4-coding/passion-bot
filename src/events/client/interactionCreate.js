const { languageRoles, welcome } = require("../../modules/messages");
const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const ids = interaction.customId.split(":");
      const currentLanguage = ids[1];
      const memberId = ids[2];
      if (memberId !== interaction.member.id) return;
      const randomMessage = welcome.messages[currentLanguage][Math.floor(Math.random()*welcome.messages[currentLanguage].length)];
      for(const roleId of Object.values(languageRoles)) {
        interaction.member.roles.remove(roleId);
      }
      interaction.member.roles.add(languageRoles[currentLanguage]);
      interaction.update(`${randomMessage}\n\n${welcome.replies[currentLanguage]}`);
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