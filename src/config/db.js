const { subDays } = require('date-fns');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();

const { MONGO_URL } = process.env;

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }
  async connect() {
    this.client = new MongoClient(MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await this.client.connect();
    this.db = await this.client.db("pfc");
    console.log("Successfully connected to DB");
  }
  async addMember(member) {
    await this.connect();
    const exist = await this.db.collection("members").findOne({ id: member.id });
    if (exist) {
      await this.client.close();
      return;
    }
    await this.db.collection("members").insertOne({ id: member.id, username: member.username });
    await this.client.close();
  }
  async addKarma(karma, memberId, type) {
    await this.connect();
    await this.db.collection("karma-entries").insertOne(
      { memberId, karma, date: new Date(), type },
    )
    await this.db.collection("members").updateOne(
      { id: memberId },
      { $inc: { karma } }
    )
    await this.client.close();
  }
  async getKarma(memberId) {
    await this.connect();
    const member = await this.db.collection("members").findOne(
      { id: memberId },
    )
    await this.client.close();
    return member.karma;
  }
  async getKarmaEntriesForToday() {
    await this.connect();
    const end = new Date();
    const start = subDays(end, 1);
    const entries = await this.db.collection("karma-entries").find({ date: { $gte: start, $lt: end } }).toArray();
    const leaders = entries.reduce(
      (accumulator, currentValue) => {
        if (accumulator[currentValue.memberId]) {
          accumulator[currentValue.memberId] = accumulator[currentValue.memberId] + currentValue.karma;
          return accumulator;
        }
        accumulator[currentValue.memberId] = currentValue.karma;
        return accumulator;
      },
      {}
    );
    const list = Object.keys(leaders).map((id) => ({ id, total: leaders[id] })).sort((a, b) => b.total - a.total);
    const first15 = list.slice(0, 15);
    const populatedFirst15 = [];
    for (let index = 0; index < first15.length; index++) {
      const item = first15[index];
      const member = await this.db.collection("members").findOne({ id: item.id });
      if (member.username && populatedFirst15.length < 10) {
        populatedFirst15.push({ ...item, username: member.username });
      }
    }
    return populatedFirst15;
  }
  async getMembersCount() {
    await this.connect();
    return this.db.collection("members").countDocuments();
  }
}

module.exports = {
  Database
}
