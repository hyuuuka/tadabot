const register = require('../../utils/slashsync');
module.exports = async (client) => {
  await register(client, client.register_arr.map((command) => ({
    name: command.name,
    description: command.description,
    options: command.options,
    type: 'CHAT_INPUT'
  })), {
    debug: true
  });
  // Register slash commands - ( If you are one of those people who read the codes I highly suggest ignoring this because I am very bad at what I am doing, thanks LMAO )
  console.log(`[ / | Slash Commands ] - ✅ Loaded all slash commands!`)
  console.log(`[STATUS] ${client.user.tag} is now online!`);
  client.user.setActivity(`/help`, { type: "PLAYING" });
  client.on("guildCreate", () => {
    client.user.setActivity(`/help`, { type: "PLAYING" });
  });
  client.on("guildDelete", () => {
    client.user.setActivity(`/help`, { type: "PLAYING" });
});
};