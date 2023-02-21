const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(interaction, client) {
    console.log("MessageCreate", member);
  }
}