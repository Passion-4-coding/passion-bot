const { channels } = require("../constants");

const logMessage = (guild, content) => {
  const channel = guild.channels.cache.get(channels.log);
  channel.send({ content });
}

const logInviteLinkPublished = (guild, member, message) => {
  logMessage(guild, `${member} Опублікував інвайт лінку. Доданий мут на 3 години.\nПовідомлення: ${message}`)
}

const logMemberIn = (guild, member) => {
  logMessage(guild, `${member} зайшов на сервер.`)
}

const logMemberOut = (guild, member) => {
  logMessage(guild, `${member} вийщов з серверу.`)
}

module.exports = {
  logInviteLinkPublished,
  logMemberIn,
  logMemberOut
}