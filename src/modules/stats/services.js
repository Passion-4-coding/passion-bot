const { StatsEntryModel } = require("./models");

const addStatEntry = (data) => {
  const karmaEntry = new StatsEntryModel({ ...data, date: new Date() });
  return karmaEntry.save();
}

const getStatEntriesForTimeRange = (start, end) => {
  return StatsEntryModel.find({ date: { $gte: start, $lt: end } });
}

module.exports = {
  addStatEntry,
  getStatEntriesForTimeRange
}