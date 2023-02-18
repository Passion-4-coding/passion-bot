const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member, client) {
    const role = member.guild.roles.cache.find(role => role.name === "Trainee");
    member.roles.add(role);
  }
}