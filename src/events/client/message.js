const { Events } = require("discord.js");
const { Database } = require("../../config/db");
const { addKarmaForMessageActivity, addKarmaForBump } = require("../../modules/karma");

const db = new Database();

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(interaction, client) {
    addKarmaForBump(interaction);
    if (interaction.author.bot) return;
    addKarmaForMessageActivity(interaction.content, interaction.member.user.id);
  } 
}