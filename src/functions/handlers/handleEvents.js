const fs = require("fs");

module.exports = (client) => {
  const { commands, commandArray } = client;
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync("./src/events");
    for(const folder of eventFolders) {
      const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter(e => e.endsWith(".js")).reverse();
      switch(folder) {
        case "client": 
          for(const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once) {
              client.once(event.name, (...args) => event.execute(...args, client));
            } else {
              client.on(event.name, (...args) => {
                return event.execute(...args, client)
              });
            }
          }
      }
    }
  }
}