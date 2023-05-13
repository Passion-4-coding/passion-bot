const { Events } = require("discord.js");
const { addStatEntryMemberBanned } = require("../../modules/stats");

module.exports = {
  name: Events.GuildBanAdd,
  once: false,
  async execute(member) {
    addStatEntryMemberBanned(member.user.id);
  }
}