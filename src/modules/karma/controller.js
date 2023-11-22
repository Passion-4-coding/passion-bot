const { EmbedBuilder, MessageType } = require("discord.js");
const { addKarmaEntry, getKarmaEntriesForTimeRange, getAllKarmaEntries } = require("./services");
const { addStatEntryMemberPromoted } = require('../stats');
const { updateMemberTotalKarma, getMemberByDiscordId, promoteRole } = require("../member");
const { subDays } = require("date-fns");
const { sumUserKarmaAndCount, calculateTotalKarma } = require("./utils");
const { channels, colors, images } = require("../../constants");
const { validateAccess, scopes } = require("../auth");
const { applyStreak } = require("../streak");

const handleKarmaApi = (app, client) => {
  app.get('/api/karma-entries', async ({ headers, query }, res) => {
    if (!await validateAccess(headers, scopes.user, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see karma entries"});
      return;
    }
    const response = await getAllKarmaEntries(query);
    res.send(response);
  })
  app.put('/api/karma-entries', async (req, res) => {
    if (!await validateAccess(req.headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to add karma entry"});
      return;
    }
    await addKarmaEntry(req.body.memberId, { karma: req.body.karma, type: req.body.type });
    const member = await updateMemberTotalKarma(req.body.memberId, req.body.karma);
    await promoteRole(member, client, addStatEntryMemberPromoted);
    res.send(member);
  })
}

const updateKarma = async (client, discordMemberId, karma, type, target, quizId) => {
  let member = await getMemberByDiscordId(discordMemberId);
  await addKarmaEntry(member._id, { karma, type, target, quizId });
  member = await updateMemberTotalKarma(member._id, karma);
  await promoteRole(member, client, addStatEntryMemberPromoted);
}

const changeKarmaManual = async (client, karma, member) => {
  const successMessage = karma > 0 ?
    `Додано ${karma} очок карми для користувача з ніком ${member.username}` : 
    `Віднято ${Math.abs(karma)} очок карми для користувача з ніком ${member.username}`

  const errorMessage = karma > 0 ?
    `Помилка при додаванні карми для користувача з ніком ${member.username}` : 
    `Помилка відняття карми для користувача з ніком ${member.username}`

  try {
    await updateKarma(client, member.id, karma, "manual");
    return new EmbedBuilder().setDescription(successMessage);
  } catch (error) {
    console.log(error);
    return new EmbedBuilder().setDescription(errorMessage);
  }
}

const addKarmaForBump = async (client, interaction) => {
  if (interaction.type !== MessageType.ChatInputCommand || (interaction.interaction.commandName !== "bump" && interaction.interaction.commandName !== "like")) return;
  for (let embed of interaction.embeds) {
    if (embed.description.includes("Bump done!") || embed.description.includes("Server bumped") || embed.description.includes("successfully liked")) {
      const nowHours = new Date().getUTCHours();
      const karmaReward = nowHours >= 22 || nowHours <= 6 ? 50 : 25
      await applyStreak(client, interaction.interaction.user, "bump", addKarmaForStreak);
      await updateKarma(client, interaction.interaction.user.id, karmaReward, "bump");
    }
  }
}

const addKarmaForMessageActivity = async (client, message, member, channelId) => {
  const divisor = channelId === channels.coffee ? 20 : 10;
  const points = Math.round(message.length/divisor);
  const karma = points > 5 ? 5 : points;
  if (karma === 0) return;
  await applyStreak(client, member, "message", addKarmaForStreak);
  return updateKarma(client, member.id, karma, "message");
}

const addKarmaForTheQuiz = (client, memberId, quizId, karma) => {
  return updateKarma(client, memberId, karma, "quiz", undefined, quizId);
}

const addKarmaForStreak = (client, memberId, karma) => {
  return updateKarma(client, memberId, karma, "streak");
}

const addKarmaForTheTelegramSubscription = (client, memberId, telegramName) => {
  return updateKarma(client, memberId, 200, "telegram", telegramName);
}

const removeKarmaForSwearWord = (client, memberId, text) => {
  return updateKarma(client, memberId, -10, "swear-word", text);
}

const addKarmaForContentMaking = async (client, memberId, karma) => {
  const successMessage = `Користувач нагороджений ${karma} очками карми`; 
  const errorMessage = `Помилка при нагороджені користувача очками карми`;

  try {
    await updateKarma(client, memberId, karma, "content-making");
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

const getQuizWeekLeaders = async () => {
  const end = new Date();
  const start = subDays(end, 7);
  try {
    const entries = await getKarmaEntriesForTimeRange(start, end, "quiz");
    const leaders = sumUserKarmaAndCount(entries);
    const list = Object.keys(leaders).map((id) => ({ ...leaders[id] })).sort((a, b) => b.karma - a.karma).filter(member => member.username);
    let text = '';
    list.forEach((entry, index) => {
      text = `${text}\n${index + 1}. ${entry.username} | Правильних відповідей: ${entry.count} | Очки карми: ${entry.karma}`;
    });
    return new EmbedBuilder().setColor(colors.primary).setDescription(text).setImage(images.quizLeaders);
  } catch (error) {
    console.error(error)
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Помилка при отриманні результатів лідерів квізу`);
  }
}

const getBestContentContributors = async () => {
  const end = new Date();
  const start = subDays(end, 7);
  try {
    const entries = await getKarmaEntriesForTimeRange(start, end, "content-making");
    if (entries.length === 0) {
      return null;
    }
    const leaders = sumUserKarmaAndCount(entries);
    const list = Object.keys(leaders).map((id) => ({ ...leaders[id] })).sort((a, b) => b.karma - a.karma).filter(member => member.username);
    let text = '';
    list.forEach((entry, index) => {
      text = `${text}\n${index + 1}. ${entry.username} | Кількість прийнятого контенту від користувача: ${entry.count} | очки карми: ${entry.karma}`;
    });
    return new EmbedBuilder().setColor(colors.primary).setDescription(text).setImage(images.contentLeaders);
  } catch (error) {
    console.error(error)
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Помилка при отриманні результатів по запропонованому контенту`);
  }
}

const getKarmaLeaderBoard = async () => {
  const end = new Date();
  const start = subDays(end, 1);
  try {
    const entries = await getKarmaEntriesForTimeRange(start, end);
    const leaders = sumUserKarmaAndCount(entries);
    const list = Object.keys(leaders).map((id) => ({ ...leaders[id] })).sort((a, b) => b.karma - a.karma).filter(member => member.username);
    let text = '';
    list.forEach((entry, index) => {
      text = `${text}\n${index + 1}. ${entry.username}: ${entry.karma}`;
    })
    return new EmbedBuilder().setColor(colors.primary).setDescription(text).setImage(images.karmaLeaders);
  } catch (error) {
    return new EmbedBuilder().setColor(colors.danger).setDescription(`Помилка при отриманні результатів по лідерам карми`);
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
  addKarmaForTheQuiz,
  getQuizWeekLeaders,
  getBestContentContributors,
  addKarmaForTheTelegramSubscription,
  handleKarmaApi,
  addKarmaForStreak
}
