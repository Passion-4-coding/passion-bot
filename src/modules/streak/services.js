const { addHours, startOfDay, endOfDay, addDays } = require("date-fns");
const { StreakEntryModel } = require("./models");

const getCurrentDate = () => {
  // converting to Kyiv Date
  return addHours(new Date(), 2);
}

const getYesterdayRange = () => {
  const now = getCurrentDate();
  const yesterday = addDays(now, 1);
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
  return StreakEntryModel.findOne({ discordMemberId, createdAt: { $gte: range.start, $lt: range.end } });
}

const updateStreak = async (streak) => {
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