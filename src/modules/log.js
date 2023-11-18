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
  logMessage(guild, `${member} вийшов з серверу.`)
}

const logMemberRoleChange = (guild, member, oldRole, newRole) => {
  logMessage(guild, `Роль ${member} була змінена з ${oldRole} на ${newRole}.`)
}

const logMemberCorrectAnswer = (guild, member) => {
  logMessage(guild, `Користувач ${member} правильно відповів на квіз.`)
}

const logMemberWrongAnswer = (guild, member) => {
  logMessage(guild, `Користувач ${member} помилився з відповіддю на квіз`)
}

const logMemberSubscribedToTelegram = (guild, member) => {
  logMessage(guild, `Користувач ${member} підписався на телеграм`)
}

module.exports = {
  logInviteLinkPublished,
  logMemberIn,
  logMemberOut,
  logMemberRoleChange,
  logMemberCorrectAnswer,
  logMemberWrongAnswer,
  logMemberSubscribedToTelegram
}