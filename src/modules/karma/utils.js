const getKarmaLeaders = (entries) => entries.reduce(
  (accumulator, currentValue) => {
    if (!currentValue.memberId) return accumulator;
    const member = accumulator[currentValue.memberId.discordId];
    if (member) {
      accumulator[currentValue.memberId.discordId] = {
        ...member,
        karma: member.karma + currentValue.karma
      }
      return accumulator;
    }
    accumulator[currentValue.memberId.discordId] = {
      username: currentValue.memberId.username,
      karma: currentValue.karma
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
  getKarmaLeaders,
  calculateTotalKarma
}