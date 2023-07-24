const { EmbedBuilder } = require("discord.js");
const { getMemberByDiscordId } = require("../member");
const { addTelegramMember, updateTelegramMember } = require("./services");
const { validateAccess } = require("../auth");

const { GUILD_ID } = process.env;

const handleTelegramMembersApi = (app) => {
  app.get('/api/telegram-members', async (req, res) => {
    if (!await validateAccess(headers, scopes.admin, client)) {
      res.status(403);
      res.send({ error: "Access Error", message: "This user is not allowed to see telegram members"});
      return;
    }
    const response = await getAllTelegramMembers();
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

const _addTelegramMember = async (discordMember, tgname) => {
  const member = await getMemberByDiscordId(discordMember.id);
  const telegramMember = {
    memberId: member._id,
    discordId: discordMember.id,
    tgname,
    active: true
  }
  return addTelegramMember(telegramMember);
};

module.exports = {
  handleTelegramMembersApi,
  addTelegramMember: _addTelegramMember
}
