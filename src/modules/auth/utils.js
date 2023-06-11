const { DISCORD_CLIENT_ID, DISCORD_SECRET, DISCORD_URI } = process.env;

const getParams = (code) => {
  const params = new URLSearchParams();
  params.append("client_id", DISCORD_CLIENT_ID);
  params.append("client_secret", DISCORD_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", DISCORD_URI);
  params.append("scope", "identify");
  return params;
}

const getToken = async (params) => {
  try {
    const response = await fetch('https://discord.com/api/v9/oauth2/token', {
      method: 'post',
      body: params,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      }
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    res.status(400);
    res.send({ error: "token", message: "Error while getting token", details: error });
    return null;
  }
}

const getDiscordUser = async (token) => {
  try {

  } catch (error) {
    res.status(400);
    res.send({ error: "user", message: "Error while getting discord user", details: error });
    return null;
  }
}

module.exports = {
  getParams,
  getToken,
  getDiscordUser
}