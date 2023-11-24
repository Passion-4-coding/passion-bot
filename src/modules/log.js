const { EmbedBuilder } = require("discord.js");
const { channels, colors, images } = require("../constants");

const logModMessage = (guild, content) => {
  const channel = guild.channels.cache.get(channels.logModerators);
  channel.send({ content });

}

const logPublicMessage = (guild, embed) => {
  const channel = guild.channels.cache.get(channels.logPublic);
  channel.send({ embeds: [embed] });
}

const logInviteLinkPublished = (guild, member, message) => {
  logModMessage(guild, `${member} Опублікував інвайт лінку. Доданий мут на 3 години.\nПовідомлення: ${message}`)
}

const logMemberIn = (guild, member) => {
  logModMessage(guild, `${member} зайшов на сервер.`)
}

const logMemberOut = (guild, member) => {
  logModMessage(guild, `${member} вийшов з серверу.`)
}

const logMemberRoleChange = (guild, member, oldRole, newRole) => {
  const embed = new EmbedBuilder().setColor(colors.primary)
    .setTitle(`Вітаємо ${member} з новою роллю ${newRole}`)
    .setImage(images.promotions[newRole]);
  logPublicMessage(guild, embed);
  logModMessage(guild, `Роль ${member} була змінена з ${oldRole} на ${newRole}.`);
}

const logMemberCorrectAnswer = (guild, member) => {
  logModMessage(guild, `Користувач ${member} правильно відповів на квіз.`)
}

const logMemberWrongAnswer = (guild, member) => {
  logModMessage(guild, `Користувач ${member} помилився з відповіддю на квіз`)
}

const logMemberSubscribedToTelegram = (guild, member) => {
  logModMessage(guild, `Користувач ${member} підписався на телеграм`)
}

const logStreakCompleted = (guild, member, length) => {
  logModMessage(guild, `Користувач ${member} виконав стрік на сьогодні і має серію з ${length} стріків`)
}

module.exports = {
  logInviteLinkPublished,
  logMemberIn,
  logMemberOut,
  logMemberRoleChange,
  logMemberCorrectAnswer,
  logMemberWrongAnswer,
  logMemberSubscribedToTelegram,
  logStreakCompleted
}