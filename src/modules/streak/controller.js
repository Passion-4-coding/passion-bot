const { logStreakCompleted } = require("../log");
const { getStreak, createStreak, updateStreak, getPreviousStreak } = require("./services");

const STREAK_COMPLETE_LENGTH = 2;
const STREAK_DAY_KARMA = 5;

const { GUILD_ID } = process.env;

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

module.exports = {
  applyStreak
}