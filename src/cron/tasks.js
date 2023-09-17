const cron = require('node-cron');
const { channels } = require("../constants");
const { getKarmaLeaderBoard, getQuizWeekLeaders, getKarmaForThePastDay } = require('../modules/karma');
const { getPastDayStats, addStatEntryMemberPromoted } = require('../modules/stats');
const { updateRoles, syncMembers } = require('../modules/member');
const { randomIntFromInterval } = require('../utils');
const { getQuiz } = require('../modules/quiz');
const { getBestContentContributors } = require('../modules/karma/controller');

const { GUILD_ID } = process.env;

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
    const embed = await getPastDayStats(getKarmaForThePastDay);
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });

  cron.schedule('00 9,12,15,18 * * *', async () => {
    const channel = client.channels.cache.get(channels.code);
    const timeout = randomIntFromInterval(1000, 10800*1000);
    setTimeout(async () => {
      const embed = await getQuiz()
      channel.send(embed);
    }, timeout)
  }, {
    timezone: 'Europe/Warsaw'
  });

  cron.schedule('0 15 * * 5', async () => {
    const embed = await getQuizWeekLeaders();
    const channel = client.channels.cache.get(channels.coffee);
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });

  cron.schedule('0 15 * * 4', async () => {
    const embed = await getBestContentContributors();
    if (!embed) return;
    const channel = client.channels.cache.get(channels.coffee);
    channel.send({ embeds: [embed] });
  }, {
    timezone: 'Europe/Warsaw'
  });

  cron.schedule('00 22 * * *', async () => {
    const guild = client.guilds.resolve(GUILD_ID);
    const guildMembers = await guild.members.fetch();
    syncMembers(guildMembers);
  }, {
    timezone: 'Europe/Warsaw'
  });
  
  cron.schedule('03 00 * * *', async () => {
    updateRoles(client, addStatEntryMemberPromoted);
  });
}


module.exports = {
  runTasks
}
