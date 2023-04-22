const { Events } = require("discord.js");
const { Database } = require("../../config/db");

const db = new Database();

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(interaction, client) {
    if (interaction.author.bot) return;
    db.addKarmaForMessageActivity(interaction.content, interaction.member.user.id);
  }
  
}