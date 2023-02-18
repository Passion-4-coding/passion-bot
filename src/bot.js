require("dotenv").config();
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");

const { TOKEN } = process.env;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync("./src/functions");
for(const folder of functionFolders) {
  const functionFiles = fs.readdirSync(`./src/functions/${folder}/`).filter(f => f.endsWith(".js"));
  for(const file of functionFiles) {
    require(`../src/functions/${folder}/${file}`)(client);
  }
}

client.handleCommands();
client.handleEvents();

client.login(TOKEN);