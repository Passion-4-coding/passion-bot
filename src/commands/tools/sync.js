const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { colors, roles } = require("../../constants");
const { syncMembers } = require("../../modules/member");

const { GUILD_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
  .setName("sync")
  .setDescription("Синхронізація даних"),
  async execute(interaction, client) {

    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const isAdmin = interaction.member.roles.cache.find(role => role.id === roles.owner);
    
    if (!isAdmin) {
      const embed =  new EmbedBuilder().setColor(colors.danger).setDescription("У вас немає доступу до цієї команди");
      await interaction.editReply({
        ephemeral: true,
        embeds: [embed]
      });
      return;
    }
    let embed;

    try {
      const guild = client.guilds.resolve(GUILD_ID);
      const guildMembers = await guild.members.fetch();
      await syncMembers(guildMembers);
      embed = new EmbedBuilder().setColor(colors.primary).setDescription("Синхронізація пройшла успішно");
    } catch (error) {
      console.log(error)
      embed = new EmbedBuilder().setColor(colors.danger).setDescription("Виникла помилка при синхронізації");
    }

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })

  }
} 