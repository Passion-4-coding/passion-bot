const fetch = require('node-fetch');
const { getParams, getToken, scopes } = require('./utils');
const { roles } = require('../../constants');

const handleAuthApi = (app, client) => {

  app.get('/api/auth', async ({ query }, res) => {
    const { code } = query;
    const params = getParams(code);
    const token = await getToken(params);
    res.send(token);
  })

  app.get('/api/user', async ({ headers }, res) => {
    const response = await fetch(' https://discord.com/api/users/@me', {
      headers: {
        "Authorization": headers['authorization'],
      }
    });
    const data = await response.json();
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const memberScopes = [];
    const member = await guild.members.fetch(data.id);
    if (member) {
      memberScopes.push(scopes.user);
    }
    if (member.roles.cache.has(roles.lead)) {
      memberScopes.push(scopes.moderator);
    }
    if (member.roles.cache.has(roles.owner)) {
      memberScopes.push(scopes.admin);
    }
    res.send({
      id: data.id,
      name: data.username,
      avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`,
      scopes: memberScopes,
    });
  })
}

module.exports = {
  handleAuthApi
}