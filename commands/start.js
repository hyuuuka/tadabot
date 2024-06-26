const ms = require("ms");
const messages = require("../utils/message");
module.exports.run = async (client, message, args) => {
  if (
    !message.member.permissions.has("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.reply(
      "🤔 **| Uh-Oh**, You need **`MANAGE_ MESSAGES`** Permission to start giveaways!"
    );
  }

  let giveawayChannel = message.mentions.channels.first();
  if (!giveawayChannel) {
    return message.reply("**🤔 | Uh-Oh**, You have to mention a valid channel!");
  }

  let giveawayDuration = args[1];
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.reply("**🤔 | Uh-Oh**, You have to specify a valid duration!");
  }

  let giveawayNumberWinners = parseInt(args[2]);
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.reply(
      "**🤔 | Uh-Oh**, You have to specify a valid number of winners!"
    );
  }

  let giveawayPrize = args.slice(3).join(" ");
  if (!giveawayPrize) {
    return message.reply("**🤔 | Uh-Oh**, You have to specify a valid prize!");
  }
  await client.giveawaysManager.start(giveawayChannel, {
    duration: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: parseInt(giveawayNumberWinners),
    hostedBy: client.config.hostedBy ? message.author : null,
    messages: {
     hostedBy: "Hosted by: {user}"
           }
  });

}
