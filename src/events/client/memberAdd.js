const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    console.log(member);
    const role = member.guild.roles.cache.get("850393978926006294");
    console.log(role);
    member.roles.add(role).catch(console.error);
  }
}