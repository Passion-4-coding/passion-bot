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
  const updatedStreak = { ...streak, activities, completed };
  return updateStreak(updatedStreak, discordMember, updatedStreak.length);
}

const getCurrentStreakLength = (streak) => {
  if (!streak) return "";
  if (streak.length === 20) return "Ти маєш максимальний стрік! Продовжуй виконувати завдання щоб отримувати 100 карми кожного дня!";
  const startText = "Ти маєш стрік довжиною в ";
  if (streak.length === 1) return `${startText} ${streak.length} день.`;
  if (streak.length > 1 && streak.length < 5) return `${startText} ${streak.length} дні.`;
  return `${startText} ${streak.length} днів.`;
}

const getCurrentStreakEmbed = async (discordMemberId, client) => {
  const currentStreak = await getStreak(discordMemberId);
  const previousStreak = await getPreviousStreak(discordMemberId);
  console.log("previousStreak", previousStreak)
  if (!currentStreak) {
    const karmaToEarn = previousStreak ? (previousStreak.length + 1) * 5 : 5;
    return new EmbedBuilder()
      .setColor(colors.danger)
      .setTitle(`${getCurrentStreakLength(previousStreak)} Щоб заробити ${karmaToEarn} карми сьогодні, виконай два завдання зі списку:`)
      .setDescription(getRestActivitiesList(client, []));
  }
  if (currentStreak.completed) {
    return new EmbedBuilder()
      .setColor(colors.primary)
      .setDescription(`Вітаю з виконанням усіх завдань на сьогодні. ${getCurrentStreakLength(currentStreak)} Сьогодні зароблено ${currentStreak.length * 5} карми.`);
  }
  return new EmbedBuilder()
    .setColor(colors.danger)
    .setTitle(`${getCurrentStreakLength(currentStreak)} Щоб заробити ${currentStreak.length * 5} карми сьогодні, виконай одне завдання зі списку:`)
    .setDescription(getRestActivitiesList(client, currentStreak.activities));
}

module.exports = {
  applyStreak,
  getCurrentStreakEmbed,
}