const { EmbedBuilder, MessageType } = require("discord.js");
const { addKarmaEntry, getKarmaEntriesForTimeRange } = require("./services");
const { updateMemberTotalKarma, getMemberByDiscordId } = require("../member");
const { subDays } = require("date-fns");
const { getKarmaLeaders, calculateTotalKarma } = require("./utils");
const { channels } = require("../../constants");

const updateKarma = async (discordMemberId, karma, type, target, quizId) => {
  const member = await getMemberByDiscordId(discordMemberId);
  await addKarmaEntry(member._id, { karma, type, target, quizId });
  await updateMemberTotalKarma(member._id, karma);
}

const changeKarmaManual = async (karma, member) => {
  const successMessage = karma > 0 ?
    `Added ${karma} karma points to user ${member.username}` : 
    `Removed ${Math.abs(karma)} karma points from user ${member.username}`

  const errorMessage = karma > 0 ?
    `Error adding karma to user ${member.username}` : 
    `Error removing karma from user ${member.username}`

  try {
    await updateKarma(member.id, karma, "manual");
    return new EmbedBuilder().setDescription(successMessage);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setDescription(errorMessage);
  }
}

const addKarmaForBump = async (interaction) => {
  if (interaction.type !== MessageType.ChatInputCommand || (interaction.interaction.commandName !== "bump" && interaction.interaction.commandName !== "like")) return;
  for (let embed of interaction.embeds) {
    if (embed.description.includes("Bump done!") || embed.description.includes("Server bumped") || embed.description.includes("successfully liked")) {
      const nowHours = new Date().getUTCHours();
      const karmaReward = nowHours >= 22 || nowHours <= 6 ? 50 : 25
      await updateKarma(interaction.interaction.user.id, karmaReward, "bump");
    }
  }
}

const addKarmaForMessageActivity = (message, memberId, channelId) => {
  const divisor = channelId === channels.coffee ? 20 : 10;
  const points = Math.round(message.length/divisor);
  const karma = points > 5 ? 5 : points;
  if (karma === 0) return;
  return updateKarma(memberId, karma, "message");
}

const addKarmaForTheQuiz = (memberId, quizId, karma) => {
  return updateKarma(memberId, karma, "quiz", undefined, quizId);
}

const removeKarmaForSwearWord = (memberId, text) => {
  return updateKarma(memberId, -10, "swear-word", text);
}

const addKarmaForContentMaking = async (memberId, karma) => {
  const successMessage = `User rewarded with ${karma} karma points`; 
  const errorMessage = `Error adding karma to user for the content making`;

  try {
    await updateKarma(memberId, karma, "content-making");
    return new EmbedBuilder().setDescription(successMessage);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setDescription(errorMessage);
  }
}

const getKarmaForThePastDay = async () => {
  const end = new Date();
  const start = subDays(end, 1);
  try {
    const entries = await getKarmaEntriesForTimeRange(start, end);
    return calculateTotalKarma(entries);
  } catch (error) {
    console.error(error)
  }
}

const getKarmaLeaderBoard = async () => {
  const end = new Date();
  const start = subDays(end, 1);
  try {
    const entries = await getKarmaEntriesForTimeRange(start, end);
    const leaders = getKarmaLeaders(entries);
    const list = Object.keys(leaders).map((id) => ({ ...leaders[id] })).sort((a, b) => b.karma - a.karma).filter(member => member.username);
    let text = '';
    list.forEach((entry, index) => {
      text = `${text}\n${index + 1}. ${entry.username}: ${entry.karma}`;
    })
    return new EmbedBuilder().setTitle("Karma leaders for the last 24 hours:").setDescription(text).setImage("https://res.cloudinary.com/de76u6w6i/image/upload/v1683985555/karma_leaderboard_yuqenx.png");
  } catch (error) {
    return new EmbedBuilder().setDescription(`Something went wrong with getting data for leader board`);
  }
}

module.exports = {
  changeKarmaManual,
  addKarmaForBump,
  addKarmaForMessageActivity,
  removeKarmaForSwearWord,
  getKarmaLeaderBoard,
  getKarmaForThePastDay,
  addKarmaForContentMaking,
  addKarmaForTheQuiz
}
