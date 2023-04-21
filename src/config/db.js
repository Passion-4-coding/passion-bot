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
    if (exist) return;
    await this.db.collection("members").insertOne({ id: member.id, username: member.username });
    await this.client.close();
  }
  async addMembers(members) {
    await this.connect();
    await this.db.collection("members").insertMany(members.map(m => ({ id: m.id, username: m.username, karma: 0 })));
    await this.client.close();
  }
}

module.exports = {
  Database
}
