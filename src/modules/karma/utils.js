const { adminId } = require("../../constants");

const sumUserKarmaAndCount = (entries) => entries.reduce(
  (accumulator, currentValue) => {
    if (!currentValue.memberId || currentValue.memberId.discordId === adminId) return accumulator;
    const member = accumulator[currentValue.memberId.discordId];
    if (member) {
      accumulator[currentValue.memberId.discordId] = {
        ...member,
        karma: member.karma + currentValue.karma,
        count: member.count + 1,
      }
      return accumulator;
    }
    accumulator[currentValue.memberId.discordId] = {
      username: currentValue.memberId.username,
      karma: currentValue.karma,
      count: 1
    }
    return accumulator;
  },
  {}
)

const calculateTotalKarma = (entries) => entries.reduce(
  (accumulator, currentValue) => currentValue.karma + accumulator,
  0
)

module.exports = {
  sumUserKarmaAndCount,
  calculateTotalKarma,
}