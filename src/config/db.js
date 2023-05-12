const mongoose = require('mongoose');
require("dotenv").config();

const { MONGO_URL } = process.env;

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }
  async connect() {
    try {
      mongoose.connect(MONGO_URL);
      console.log("Successfully connected to DB");
    } catch (error) {
      console.error("Error while connecting to DB", error);
    }
  }
}

module.exports = {
  Database
}
