const { MemberModel, getAllMembers } = require("../member");
const { KarmaEntryModel } = require("./models");

const addKarmaEntry = (memberId, data) => {
  const karmaEntry = new KarmaEntryModel({ ...data, memberId, date: new Date() });
  return karmaEntry.save();
}

const getKarmaEntriesFor24h = (start, end) => {
  return KarmaEntryModel.find({ date: { $gte: start, $lt: end } }).populate("memberId");
}

const updateKarmaEntriesMemberIds = async () => {
  const entries = await KarmaEntryModel.find().populate().exec();
}

module.exports = {
  addKarmaEntry,
  getKarmaEntriesFor24h,
  updateKarmaEntriesMemberIds
}