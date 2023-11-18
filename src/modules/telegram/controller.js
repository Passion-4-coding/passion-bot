const { getMemberByDiscordId } = require("../member");
const { addTelegramMember, updateTelegramMember, isExists, getAllTelegramMembers } = require("./services");
const { validateAccess, scopes } = require("../auth");
const { colors } = require("../../constants");
const { EmbedBuilder } = require("discord.js");
const { addKarmaForTheTelegramSubscription } = require("../karma");
const { logMemberSubscribedToTelegram } = require("../log");

const { GUILD_ID } = process.env;

const handleTelegramMembersApi = (app, client) => {
  app.get('/api/telegram-members', async ({ headers, query }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see telegram members"});
      return;
    }
    const response = await getAllTelegramMembers(query);
    res.send(response);
  })

  app.patch('/api/telegram-members/:id', async ({ params, headers, body }, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to edit telegram members"});
      return;
    }
    const response = await updateTelegramMember(params.id, body);
    res.send(response);
  })
}

const addTelegramMemberAndGenerateEmbed = async (client, discordId, tgname, discordMember) => {
  const exists = await isExists(discordId);
  const guild = client.guilds.resolve(GUILD_ID);
  if (exists) {
    return new EmbedBuilder().setColor(colors.danger).setDescription("Ти вже отримав карму за підписку на телеграм");
  }
  const member = await getMemberByDiscordId(discordId);
  const telegramMember = {
    memberId: member._id,
    discordId,
    tgname,
    active: true,
    createdOn: new Date(),
    updatedOn: new Date(),
  }
  try {
    await addTelegramMember(telegramMember);
    await addKarmaForTheTelegramSubscription(client, discordId, tgname);
    await logMemberSubscribedToTelegram(guild, discordMember);
    return new EmbedBuilder().setColor(colors.primary)
      .setTitle("Ви отримали 200 карми!")
      .setDescription("Вітаємо і дякуємо за підписку на наш телеграм. \n Мусимо попередити, що у разі відписки або хибного нікнейму я буду вимушений повернути карму назад.");
  } catch (error) {
    console.log(error)
    return new EmbedBuilder().setColor(colors.danger).setDescription("Виникла помилка, зверніться до адміністратора");
  }
  
};

module.exports = {
  handleTelegramMembersApi,
  addTelegramMemberAndGenerateEmbed
}
