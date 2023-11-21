const { startOfDay, endOfDay, subDays } = require("date-fns");
const { StreakEntryModel } = require("./models");

const getCurrentDate = () => {
  return new Date();
}

const getYesterdayRange = () => {
  const now = getCurrentDate();
  console.log(now);
  const yesterday = subDays(now, 1);
  console.log(yesterday);
  return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
}

const getTodaysDateRange = () => {
  const now = getCurrentDate();
  return { start: startOfDay(now), end: endOfDay(now) };
}

const getStreak = async (discordMemberId) => {
  const range = getTodaysDateRange();
  return StreakEntryModel.findOne({ discordMemberId, createdAt: { $gte: range.start, $lt: range.end } });
}

const getPreviousStreak = async (discordMemberId) => {
  const range = getYesterdayRange();
  console.log(range)
  return StreakEntryModel.findOne({ discordMemberId, createdAt: { $gte: range.start, $lt: range.end } });
}

const updateStreak = async (streak) => {
  const range = getYesterdayRange();
  return StreakEntryModel.findOneAndUpdate({
    discordMemberId: streak.discordMemberId,
    createdAt: { $gte: range.start, $lt: range.end }
  },
  streak, { new: true });
}

const createStreak = async (streak) => {
  const newStreak = new StreakEntryModel({
    ...streak,
    createdAt: getCurrentDate(),
    updatedAt: getCurrentDate()
  });
  try {
    return newStreak.save();
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getStreak,
  updateStreak,
  createStreak,
  getPreviousStreak
}