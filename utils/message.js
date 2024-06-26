const config = require('../config.json');
module.exports = {
  giveaway:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY** 🎉",
  giveawayEnded:
    (config.everyoneMention ? "@everyone\n\n" : "") +
    "🎉 **GIVEAWAY ENDED** 🎉",
  drawing:  `Ends: **{timestamp}**`,
  inviteToParticipate: `React with 🎉 to participate in the giveaway!`,
  winMessage: "🥳 **Congratulations,** {winners}! You won **`{this.prize}`**!",
  embedFooter: "TadaBot",
  noWinner: "🤔 | No valid participants, Winner(s) cannot be chosen or determined.",
  hostedBy: "Hosted by: {this.hostedBy}",
  winners: "Winner(s)",
  endedAt: "Ended: "
}