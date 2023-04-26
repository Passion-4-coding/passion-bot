const cron = require('node-cron');
const { channels } = require("../constants");
const { getKarmaLeaderBoard } = require('../modules/karma');
const { EmbedBuilder } = require('discord.js');

const runTasks = (client) => {
  cron.schedule('0 16 * * *', async () => {
    const channel = client.channels.cache.get(channels.coffee);
    const entries = await getKarmaLeaderBoard();
    let text = '';
    entries.forEach((entry, index) => {
      text = `${text} \n ${index}. ${entry.username}: ${entry.total}`;
    })
    const embed = new EmbedBuilder().setTitle("Karma leaders for the last 24 hours:").setDescription(text);
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });
}

module.exports = {
  runTasks
}
