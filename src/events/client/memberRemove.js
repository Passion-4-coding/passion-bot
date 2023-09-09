const { Events } = require("discord.js");
const { removeMember } = require("../../modules/member");
const { addStatEntryMemberRemove } = require("../../modules/stats");
const { logMemberOut } = require("../../modules/log");

module.exports = {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member) {
    addStatEntryMemberRemove(member.user.id);
    logMemberOut(member.guild, member);
  }
}