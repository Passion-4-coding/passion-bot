const cron = require('node-cron');
const { channels } = require("../constants");
const { getKarmaLeaderBoard } = require('../modules/karma');
const { getPastDayStats, addStatEntryMemberPromoted } = require('../modules/stats');
const { updateRoles } = require('../modules/member');

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
  
  cron.schedule('0 0 */1 * * *', async () => {
    updateRoles(client, addStatEntryMemberPromoted);
  });
}


module.exports = {
  runTasks
}
