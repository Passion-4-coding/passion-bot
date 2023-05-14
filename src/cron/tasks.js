const cron = require('node-cron');
const { channels } = require("../constants");
const { getKarmaLeaderBoard } = require('../modules/karma');
const { getPastDayStats } = require('../modules/stats');

const runTasks = (client) => {
  cron.schedule('0 16 * * *', async () => {
    const channel = client.channels.cache.get(channels.coffee);
    const embed = await getKarmaLeaderBoard();
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });
  cron.schedule('0 12 * * *', async () => {
    const channel = client.channels.cache.get(channels.coffee);
    const embed = await getPastDayStats();
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });
}


module.exports = {
  runTasks
}
