const { Events } = require("discord.js");
const { removeMember } = require("../../modules/member");

module.exports = {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member) {
    removeMember(member);
  }
}