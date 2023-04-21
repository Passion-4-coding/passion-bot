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
  async addMessageKarma(message, memberId) {
    const karma = Math.round(message.length/10);
    if (karma === 0) return;
    await this.connect();
    await this.db.collection("members").updateOne(
      { id: memberId },
      { $inc: { karma } }
    )
    await this.client.close();
  }
  async addKarma(karma, memberId) {
    await this.connect();
    await this.db.collection("members").updateOne(
      { id: memberId },
      { $inc: { karma } }
    )
    await this.client.close();
  }
}

module.exports = {
  Database
}
