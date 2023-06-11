import { ObjectId } from "mongodb";

const mongoose = require("mongoose");

const AuthLogSchema = new mongoose.Schema({
  memberId: {
    type: ObjectId,
    ref: 'members',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
});

const AuthLogModel = mongoose.model('authLog', AuthLogSchema);

module.exports = {
  AuthLogSchema,
  AuthLogModel
}