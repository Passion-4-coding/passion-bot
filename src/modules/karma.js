const { EmbedBuilder } = require("discord.js");
const { Database } = require("../config/db");
const db = new Database();

const addKarmaPoints = async (points, user) => {
  try {
    await db.addKarma(points, user.id);
    return new EmbedBuilder().setDescription(`Added ${points} karma points to user ${user.username}`);
  } catch (error) {
    return new EmbedBuilder().setDescription(`Error adding karma to user ${user.username}`);
  }
}

module.exports = {
  addKarmaPoints
}