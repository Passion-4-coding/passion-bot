const cron = require('node-cron');
const { channels } = require("../constants");
const { getKarmaLeaderBoard } = require('../modules/karma');

const runTasks = (client) => {
  cron.schedule('0 16 * * *', async () => {
    const channel = client.channels.cache.get(channels.coffee);
    const embed = await getKarmaLeaderBoard();
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });
}

module.exports = {
  runTasks
}
