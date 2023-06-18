const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { channels } = require("../../constants");
const { addKarmaForContentMaking } = require("../karma");

const handleDraftMessage = async (interaction, client) => {
  if (interaction.member.user.bot) return;
  const draft = client.channels.cache.get(channels.draft);
  const draftReview = client.channels.cache.get(channels.draft_review);

  const responseEmbed = new EmbedBuilder()
  .setTitle(`Content has been added for the review`)
  .setDescription(`Thank you ${interaction.member}. We will review your request soon.`)
  
  draft.send({ embeds: [responseEmbed] });

  const contentEmbed = new EmbedBuilder()
  .setTitle(`Request from ${interaction.member.user.username}`)
  .setDescription(interaction.content || "No message content")

  const embeds = [contentEmbed];

  if (interaction.attachments) {
    interaction.attachments.forEach(attachment => {
      const attachmentEmbed = new EmbedBuilder()
      .setTitle(`Attachment name: ${attachment.name}`)
      .setImage(attachment.attachment);
      embeds.push(attachmentEmbed);
    });
  }

  const buttons = new ActionRowBuilder();

  const button50 = new ButtonBuilder()
  .setCustomId(`${interaction.member.id}:50`)
  .setLabel("Reward 50")
  .setStyle(ButtonStyle.Primary);

  const button100 = new ButtonBuilder()
  .setCustomId(`${interaction.member.id}:100`)
  .setLabel("Reward 100")
  .setStyle(ButtonStyle.Primary);

  buttons.addComponents(button50).addComponents(button100);

  draftReview.send({ embeds, components: [buttons] });

  interaction.delete();
}

const handleRewardMemberForContent = async (interaction) => {
  await interaction.deferReply({
    ephemeral: true,
    fetchReply: true
  })
  const ids = interaction.customId.split(":");
  const memberId = ids[0];
  const reward = Number(ids[1]);
  const embed = await addKarmaForContentMaking(memberId, reward);
  return interaction.editReply({
    embeds: [embed]
  })
}

module.exports = {
  handleDraftMessage,
  handleRewardMemberForContent
}