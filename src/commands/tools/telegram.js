const { SlashCommandBuilder } = require("discord.js");
const { addTelegramMemberAndGenerateEmbed } = require("../../modules/telegram");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("telegram")
  .setDescription("Телеграм підписка")
  .addStringOption(option =>
    option.setName('telegram-name')
      .setDescription('Ваш нікнейм в телеграм')
      .setRequired(true)),
  async execute(interaction, client) {

    await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    })

    const option = interaction.options.get('telegram-name');

    const telegramName = option.value;
    const discordId = interaction.user.id;

    const embed = await addTelegramMemberAndGenerateEmbed(client, discordId, telegramName, interaction.user);

    await interaction.editReply({
      ephemeral: true,
      embeds: [embed]
    })

  }
} 