const { EmbedBuilder, MessageType } = require("discord.js");
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
    const entries = await db.getKarmaEntriesForToday();
    let text = '';
    entries.forEach((entry, index) => {
      text = `${text} \n ${index + 1}. ${entry.username}: ${entry.total}`;
    })
    return new EmbedBuilder().setTitle("Karma leaders for the last 24 hours:").setDescription(text);
  } catch (error) {
    return new EmbedBuilder().setDescription(`Something went wrong with getting data for leader board`);
  }
}

const addKarmaForBump = async (interaction) => {
  if (interaction.type !== MessageType.ChatInputCommand || interaction.interaction.commandName !== "bump") return;
  for (let embed of interaction.embeds) {
    if (embed.description.includes("Bump done!") || embed.description.includes("Server bumped")) {
      db.addKarma(50, interaction.interaction.user.id);
    }
  }
}

const addKarmaForMessageActivity = (message, memberId) => {
  const points = Math.round(message.length/20);
  const karma = points > 5 ? 5 : points;
  if (karma === 0) return;
  return db.addKarma(karma, memberId);
}



module.exports = {
  changeKarmaPoints,
  getKarmaPoints,
  getKarmaLeaderBoard,
  addKarmaForBump,
  addKarmaForMessageActivity
}