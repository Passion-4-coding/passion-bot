require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const { TOKEN, OPEN_AI_API_KEY } = process.env;

const client = new Client({ intents: GatewayIntentBits.Guilds });
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