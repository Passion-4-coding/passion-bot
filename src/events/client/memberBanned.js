const { Events } = require("discord.js");
const { addStatEntryMemberBanned } = require("../../modules/stats");

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(member) {
    console.log(member);
    console.log(member.user);
    console.log(member.user.id);
    addStatEntryMemberBanned(member.user.id);
  }
}