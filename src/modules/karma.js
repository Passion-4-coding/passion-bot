const { EmbedBuilder } = require("discord.js");
const { Database } = require("../config/db");
const db = new Database();

const changeKarmaPoints = async (points, user) => {

  const successMessage = points > 0 ?
    `Added ${points} karma points to user ${user.username}` : 
    `Removed ${Math.abs(points)} karma points from user ${user.username}`

  const errorMessage = points > 0 ?
    `Error adding karma to user ${user.username}` : 
    `Error removing karma from user ${user.username}`

  try {
    await db.addKarma(points, user.id);
    return new EmbedBuilder().setDescription(successMessage);
  } catch (error) {
    return new EmbedBuilder().setDescription(errorMessage);
  }
}

const getKarmaPoints = async (user) => {
  try {
    const karma = await db.getKarma(user.id);
    return new EmbedBuilder().setDescription(`User ${user.username} has ${karma} karma points`);
  } catch (error) {
    return new EmbedBuilder().setDescription(`Error getting karma for user ${user.username}`);
  }
}

const getKarmaLeaderBoard = async () => {
  try {
    return await db.getKarmaEntriesForToday();
    //return new EmbedBuilder().setDescription(`User ${user.username} has ${karma} karma points`);
  } catch (error) {
    console.log(error);
    //return new EmbedBuilder().setDescription(`Error getting karma for user ${user.username}`);
  }
}



module.exports = {
  changeKarmaPoints,
  getKarmaPoints,
  getKarmaLeaderBoard
}