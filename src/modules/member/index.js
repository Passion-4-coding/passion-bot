const {
  handleMemberApi,
  getMemberByDiscordId,
  getMemberById,
  addMember,
  getMemberTotalKarma,
  updateMemberTotalKarma,
  getAllMembers,
  removeMember,
  updateRoles,
  syncMembers
} = require("./controller");

module.exports = {
  handleMemberApi,
  getMemberById,
  getMemberByDiscordId,
  addMember,
  getMemberTotalKarma,
  updateMemberTotalKarma,
  getAllMembers,
  removeMember,
  updateRoles,
  syncMembers
}