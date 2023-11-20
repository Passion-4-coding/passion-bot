const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { channels, colors } = require("../../constants");
const { addKarmaForContentMaking, addKarmaForStreak } = require("../karma");
const { applyStreak } = require("../streak");

const handleDraftMessage = async (interaction, client) => {
  if (interaction.member.user.bot) {
    setTimeout(() => {
      interaction.delete()
    }, 3600  * 1000);
    return;
  }
  const draft = client.channels.cache.get(channels.draft);
  const draftReview = client.channels.cache.get(channels.draft_review);

  await applyStreak(client, interaction.member, "content-making", addKarmaForStreak);

  const responseEmbed = new EmbedBuilder()
  .setColor(colors.primary)
  .setTitle(`Контент був переданий до узгодження`)
  .setDescription(`Дякую ${interaction.member}! Твоя пропозиція по контенту буде переглянута в найближчий час.\n\n*Це повідомлення буде автоматично видалене через годину*`)

  draft.send({ embeds: [responseEmbed] });

  const contentEmbed = new EmbedBuilder()
  .setColor(colors.primary)
  .setTitle(`Пропозиція від ${interaction.member.user.username}`)
  .setDescription(interaction.content || "Без тексту")

  const embeds = [contentEmbed];

  if (interaction.attachments) {
    interaction.attachments.forEach(attachment => {
      const attachmentEmbed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`Назва вкладення: ${attachment.name}`)
      .setDescription(`Вкладення: ${attachment.attachment}`)
      .setImage(attachment.url);
      embeds.push(attachmentEmbed);
    });
  }

  const buttons = new ActionRowBuilder();

  const button50 = new ButtonBuilder()
  .setCustomId(`${interaction.member.id}:50`)
  .setLabel("Нагорода 50")
  .setStyle(ButtonStyle.Primary);

  const button100 = new ButtonBuilder()
  .setCustomId(`${interaction.member.id}:100`)
  .setLabel("Нагорода 100")
  .setStyle(ButtonStyle.Primary);

  buttons.addComponents(button50).addComponents(button100);

  draftReview.send({ embeds, components: [buttons] });
  interaction.delete();
}

const handleRewardMemberForContent = async (client, interaction) => {
  await interaction.deferReply({
    ephemeral: true,
    fetchReply: true
  })
  const ids = interaction.customId.split(":");
  const memberId = ids[0];
  const reward = Number(ids[1]);
  const embed = await addKarmaForContentMaking(client, memberId, reward);
  return interaction.editReply({
    embeds: [embed]
  })
}

module.exports = {
  handleDraftMessage,
  handleRewardMemberForContent
}