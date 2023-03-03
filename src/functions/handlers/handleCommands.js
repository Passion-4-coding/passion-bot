const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const { CLIENT_ID, GUILD_ID, TOKEN } = process.env;

module.exports = (client) => {
  const { commands, commandArray } = client;
  client.handleCommands = async () => {
    const commandsFolders = fs.readdirSync("./src/commands");
    for(const folder of commandsFolders) {
      const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(c => c.endsWith(".js"));
      for(const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has been registered`);
      }
    }

    const rest = new REST({ version: 9 }).setToken(TOKEN);

    try {
      console.log("Started refreshing application (/) commands");

      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commandArray
      })

      console.log("Successfully reloaded application (/) commands");
    } catch (error) {
      console.error(error);
    }
  }
}