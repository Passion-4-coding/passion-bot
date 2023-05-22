const { Events } = require("discord.js");
const { addStatEntryMemberBanned } = require("../../modules/stats");

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(member) {
    console.log("user", member.user);
    console.log("id", member.user.id);
    addStatEntryMemberBanned(member.user.id);
  }
}