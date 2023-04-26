require("dotenv").config();
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
require("./api/server");
const fs = require("fs");
const Sentry = require("@sentry/node");
const { runTasks } = require("./cron/tasks");

const { TOKEN, SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember  ]
});

runTasks(client);

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