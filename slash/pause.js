const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: "pause",
  description: '⏸ Pause a giveaway',
  options: [
    {
      name: 'giveaway',
      description: 'The giveaway to pause (message ID or giveaway prize)',
      type: 'STRING',
      required: true
    }
  ],
  run: async (client, interaction) => {
    // Check if the server is a VIP server
    const vipServers = JSON.parse(fs.readFileSync('./storage/vip_servers.json', 'utf-8'));
    if (!vipServers.includes(interaction.guild.id)) {
      return interaction.reply({
        content: 'This command can only be used on VIP servers.',
        ephemeral: true
      });
    }

    // If the member doesn't have enough permissions
    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: You need to have the manage messages permissions to pause giveaways.',
        ephemeral: true
      });
    }

    const query = interaction.options.getString('giveaway');

    // try to find the giveaway with prize alternatively with ID
    const giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

    // If no giveaway was found
    if (!giveaway) {
      return interaction.reply({
        content: 'Unable to find a giveaway for `' + query + '`.',
        ephemeral: true
      });
    }

    if (giveaway.pauseOptions.isPaused) {
      const alrpausedEmbed = new MessageEmbed()
        .setTitle("<:no:907941625018343434> | Already Paused")
        .setDescription(`[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) is already paused.`)
        .setColor("#fa3e3e");

      return interaction.reply({ embeds: [alrpausedEmbed], ephemeral: true });
    }

    client.giveawaysManager.pause(giveaway.messageId)
      .then(() => {
        const pausedEmbed = new MessageEmbed()
          .setTitle("<:pause:1090643777904988350> | Giveaway Paused")
          .setDescription(`[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has now been paused!`)
          .setColor("#355bfa");

        interaction.reply({ embeds: [pausedEmbed], ephemeral: true });
      })
      .catch((e) => {
        const errorEmbed = new MessageEmbed()
          .setTitle("<:no:907941625018343434> | Error")
          .setDescription(`An error occurred while trying to pause the giveaway:\n\`\`\`${e}\`\`\``)
          .setColor("#fa3e3e");

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      });
  }
};