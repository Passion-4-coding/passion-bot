const { Events } = require("discord.js")

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`User ${client.user.tag} is logged and online!`)
  }
}