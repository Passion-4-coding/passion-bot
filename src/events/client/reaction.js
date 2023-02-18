const { Events } = require("discord.js")

module.exports = {
  name: Events.MessageReactionAdd,
  once: false,
  async execute(interaction, client) {
  }
}