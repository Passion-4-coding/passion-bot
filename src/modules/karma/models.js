const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const KarmaEntrySchema = new mongoose.Schema({
  memberId: { type: ObjectId, ref: 'members' },
  karma: Number,
  date: Date,
  type: {
    type: String,
    enum: ["manual", "bump", "message", "swear-word"]
  },
  target: String
});

const KarmaEntryModel = mongoose.model('karma-entries', KarmaEntrySchema);

module.exports = {
  KarmaEntrySchema,
  KarmaEntryModel
}