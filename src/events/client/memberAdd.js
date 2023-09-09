const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { welcome } = require("../../modules/messages");
const { roles, channels, languages } = require("../../constants");
const { addMember } = require("../../modules/member");
const { addStatEntryMemberAdd } = require("../../modules/stats");
const { logMemberIn } = require("../../modules/log");

module.exports = {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    await addMember(member.user);
    addStatEntryMemberAdd(member.user.id);
    logMemberIn(member.guild, member);
    const role = member.guild.roles.cache.get(roles.trainee);
    member.roles.add(role).catch(console.error);
    const channel = member.guild.channels.cache.get(channels.reception);
    const karmaChannel = member.guild.channels.cache.get(channels.karma);
    const randomMessage = welcome.messages.ua[Math.floor(Math.random()*welcome.messages.ua.length)];
    const message = `${randomMessage}\n\n*Підпишись на наш телеграм - https://t.me/pfc_ua і забирай 200 карми. Деталі в ${karmaChannel.toString()}*`

    const buttons = new ActionRowBuilder()
    buttons.addComponents(
      new ButtonBuilder()
        .setCustomId(`${roles.en}:en:${member.id}`)
        .setLabel(welcome.buttons.en)
        .setStyle(ButtonStyle.Primary),
    );
    await channel.send({ content: `${member}\n${message}`, components: [buttons] });
  }
}