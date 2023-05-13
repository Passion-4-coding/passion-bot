const calculateMessages = (entries) => entries.reduce(
  (accumulator, currentValue) => {
    if (currentValue.type !== "message") return accumulator;
    return currentValue.amount + accumulator;
  },
  0
)

module.exports = {
  calculateMessages
}