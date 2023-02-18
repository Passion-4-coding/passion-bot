const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const role = member.guild.roles.cache.get("850393978926006294");
    member.roles.add(role).catch(console.error);
  }
}