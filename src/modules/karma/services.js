const { KarmaEntryModel } = require("./models");

const addKarmaEntry = (memberId, data) => {
  const karmaEntry = new KarmaEntryModel({ ...data, memberId, date: new Date() });
  return karmaEntry.save();
}

const getKarmaEntriesForTimeRange = (start, end, type) => {
  if (type) {
    return KarmaEntryModel.find({ date: { $gte: start, $lt: end }, type }).populate("memberId");
  }
  return KarmaEntryModel.find({ date: { $gte: start, $lt: end } }).populate("memberId");
}

const getAllKarmaEntries = async (params) => {
  const { page = 1, pageSize = 10, type, memberId, from, to } = params;
  const query = {};
  if (type) query.type = type;
  if (memberId) query.memberId = type;
  if (from && to) query.date = { $gte: new Date(from), $lt: new Date(to) };

  const list = await KarmaEntryModel.find(query).limit(pageSize).skip(pageSize * (page - 1)).sort("-date").populate("memberId");
  const total = await KarmaEntryModel.countDocuments(query);
  return {
    list,
    total
  }
}

const updateKarmaEntriesMemberIds = async () => {
  const entries = await KarmaEntryModel.find().populate().exec();
}

module.exports = {
  addKarmaEntry,
  getKarmaEntriesForTimeRange,
  updateKarmaEntriesMemberIds,
  getAllKarmaEntries
}