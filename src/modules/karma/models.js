const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const KarmaEntrySchema = new mongoose.Schema({
  memberId: {
    type: ObjectId,
    ref: 'members',
    required: true
  },
  karma: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["manual", "bump", "message", "swear-word"]
  },
  target: String
});

const KarmaEntryModel = mongoose.model('karma-entries', KarmaEntrySchema);

module.exports = {
  KarmaEntrySchema,
  KarmaEntryModel
}