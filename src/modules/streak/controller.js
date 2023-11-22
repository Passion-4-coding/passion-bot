const { EmbedBuilder } = require("discord.js");
const { colors, channels } = require("../../constants");
const { logStreakCompleted } = require("../log");
const { getStreak, createStreak, updateStreak, getPreviousStreak } = require("./services");

const STREAK_COMPLETE_LENGTH = 2;
const STREAK_DAY_KARMA = 5;
const ALL_ACTIVITIES = ["bump", "message", "content-making", "quiz"];


const { GUILD_ID } = process.env;

const getRestActivitiesList = (client, activities) => {
  const guild = client.guilds.resolve(GUILD_ID);
  const restActivities = ALL_ACTIVITIES.filter(a => !activities.includes(a));
  let list = "";
  restActivities.forEach(activity => {
    if (activity === "message") {
      list = `${list}\n- Відправити повідомлення в будь якому каналі довжиною не менше 20ти символів.`
    }
    if (activity === "bump") {
      const bot =  guild.channels.cache.get(channels.bot);
      list = `${list}\n- Бампнути сервер в ${bot.toString()}`;
    }
    if (activity === "content-making") {
      const draft =  guild.channels.cache.get(channels.draft);
      list = `${list}\n- Запропонувати контент в ${draft.toString()}`;
    }
    if (activity === "quiz") {
      const code =  guild.channels.cache.get(channels.code);
      list = `${list}\n- Відповісти правильно на квіз в ${code.toString()}`;
    }
  });
  return list;
}

const applyStreak = async (client, discordMember, activity, addKarmaForStreak) => {
  const discordMemberId = discordMember.id;
  const streak = await getStreak(discordMemberId);
  const previousStreak = await getPreviousStreak(discordMemberId);
  const guild = client.guilds.resolve(GUILD_ID);

  if (!streak) { // create new streak
    const currentLength = previousStreak?.completed ? previousStreak.length : 0;
    const length = currentLength >= 20 ? 20 : currentLength + 1
    const newStreak = { discordMemberId, activities: [activity], completed: false, length };
    return createStreak(newStreak);
  }

  // skip if streak is already completed
  if (streak.completed) return;

  // skip if streak already has provided activity
  if (streak.activities.includes(activity)) return;

  // update streak if exists but not completed
  const activities = [...streak.activities, activity];
  const completed = activities.length === STREAK_COMPLETE_LENGTH;

  if (completed) {
    await addKarmaForStreak(client, discordMemberId, STREAK_DAY_KARMA * streak.length);
    await logStreakCompleted(guild, discordMember, streak.length, STREAK_DAY_KARMA * streak.length);
  }
  const updatedStreak = { 
    createdAt: streak.createdAt,
    updatedAt: streak.updatedAt,
    discordMemberId: streak.discordMemberId,
    activities,
    completed,
    length: streak.length
  };
  return updateStreak(updatedStreak);
}

const getStreakLengthText = (length) => {
  if (length === 1) {
    return `Ти маєш стрік в 1 день.`
  }
  if (length > 1 && length < 5) {
    return `Ти маєш стрік в ${length} дні.`
  }
  if (length === 0 || length > 4) {
    return `Ти маєш стрік в ${length} днів.`
  }
}

const getCurrentStreakEmbed = async (discordMemberId, client) => {
  const currentStreak = await getStreak(discordMemberId);
  const previousStreak = await getPreviousStreak(discordMemberId);
  
  if ((!currentStreak && !previousStreak?.completed)) {
    return new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`Розпочни свій стрік сьогодні. Щоб заробити 5 карми, виконай два завдання зі списку:`)
      .setDescription(getRestActivitiesList(client, []));
  }

  if ((!previousStreak?.completed && currentStreak?.length === 1)) {
    return new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`Розпочни свій стрік сьогодні. Щоб заробити 5 карми, тобі залишилось виконати лише одне завдання зі списку:`)
      .setDescription(getRestActivitiesList(client, currentStreak.activities));
  }

  if (!currentStreak && previousStreak?.completed) {
    const currentStreakLength = previousStreak.length;
    const karmaToEarn = (currentStreakLength + 1) * 5;
    return new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`${getStreakLengthText(currentStreakLength)} Продовжи стрік, щоб заробити ${karmaToEarn} карми. Виконай два завдання зі списку:`)
      .setDescription(getRestActivitiesList(client, []));
  }

  if (currentStreak && !currentStreak.completed && currentStreak.activities.length === 1) {
    const currentStreakLength = currentStreak.length - 1;
    const karmaToEarn = (currentStreakLength + 1) * 5;
    return new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`${getStreakLengthText(currentStreakLength)} Продовжи стрік, щоб заробити ${karmaToEarn} карми. Тобі залишилось виконати лише одне завдання зі списку:`)
      .setDescription(getRestActivitiesList(client, currentStreak.activities));
  }

  if (currentStreak.completed) {
    const currentStreakLength = currentStreak.length;
    const karmaEarned = currentStreakLength * 5;
    return new EmbedBuilder()
    .setColor(colors.danger)
    .setTitle(`Вітаю! Ти виконав стрік за сьогодні і заробив ${karmaEarned} карми. Наступний cтрік буде доступний завтра.`)
  }
}

module.exports = {
  applyStreak,
  getCurrentStreakEmbed,
}