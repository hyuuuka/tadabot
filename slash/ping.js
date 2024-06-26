const { MessageEmbed } = require("discord.js")

module.exports = {
  name: 'ping',
  description: 'Check the Latencys/Pings!',
  run: async (client, interaction) => {
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    let pingQuality;

    if (latency < 100) {
      pingQuality = "<:GoodConnection:1090647995931959326> **\`Good\`**";
    } else if (apiLatency < 300) {
      pingQuality = "<:NormalConnection:1090647991783792710> **\`Normal\`**";
    } else {
      pingQuality = "<:BadConnection:1090647988667433041> **\`Bad\`**";
    }

    const pingEmbed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle("Pong 🏓")
      .addField('Latency:', `\`📡\` \`${latency}ms\``)
      .addField('API Latency:', `\`🛰️\` \`${apiLatency}ms\``)
      .addField('Ping Quality:', pingQuality)
      .setTimestamp()
      .setFooter(`${interaction.user.username}`, interaction.user.avatarURL());

    interaction.reply({ embeds: [pingEmbed] });
  },
};