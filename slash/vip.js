const fs = require('fs');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'vip',
  description: 'Adds or removes server(s) from the VIP list',
  options: [
    {
      name: 'servers',
      type: 'STRING',
      description: 'The ID(s) of the server(s) to add or remove from the VIP list',
      required: true,
    },
    {
      name: 'action',
      type: 'STRING',
      description: 'The action to perform: "add" or "remove"',
      required: true,
      choices: [
        { name: 'Add', value: 'add' },
        { name: 'Remove', value: 'remove' },
      ],
    },
  ],
  async execute(interaction) {
    // Check if the user has the necessary permissions to manage the VIP list
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
      return interaction.reply({ content: 'You do not have permission to manage the VIP list.', ephemeral: true });
    }

    // Get the server IDs from the command options
    const serverIds = interaction.options.getString('servers').split(',');
    const action = interaction.options.getString('action');

    try {
      let vipServers = [];

      // Read the VIP server list from the JSON file
      let data = fs.readFileSync('./storage/vip_servers.json', 'utf-8');
      if (data) {
        vipServers = JSON.parse(data);
      }

      const addedServers = [];
      const removedServers = [];

      serverIds.forEach((serverId) => {
        // Check if the server ID is already in the VIP server list
        const index = vipServers.indexOf(serverId);

        if (action === 'remove') {
          if (index !== -1) {
            // If the server ID is in the VIP server list, remove it
            vipServers.splice(index, 1);
            removedServers.push(serverId);
          }
        } else if (action === 'add') {
          if (index === -1) {
            // If the server ID is not in the VIP server list, add it
            vipServers.push(serverId);
            addedServers.push(serverId);
          }
        }
      });

      // Write the updated VIP server list back to the JSON file
      fs.writeFileSync('./storage/vip_servers.json', JSON.stringify(vipServers));

      const logEmbeds = [];

      if (addedServers.length > 0) {
        // Create an embed for the added servers
        const addedEmbed = new MessageEmbed()
          .setColor('#4b5af9')
          .setTitle('Server(s) Added to VIP List')
          .setDescription(`The following server(s) have been added to the VIP list by ${interaction.user}:\n\n${addedServers.join('\n')}`);

        logEmbeds.push(addedEmbed);
      }

      if (removedServers.length > 0) {
        // Create an embed for the removed servers
        const removedEmbed = new MessageEmbed()
          .setColor('#f94242')
          .setTitle('Server(s) Removed from VIP List')
          .setDescription(`The following server(s) have been removed from the VIP list by ${interaction.user}:\n\n${removedServers.join('\n')}`);

        logEmbeds.push(removedEmbed);
      }

      // Send the log embeds
      if (logEmbeds.length > 0) {
        const logChannelId = '1135365633400381540'; // Replace with your own log channel ID
        const logChannel = interaction.guild.channels.cache.get(logChannelId);
        if (logChannel && logChannel.isText()) {
          logEmbeds.forEach((embed) => {
            logChannel.send({ embeds: [embed] });
          });
        }
      }

      return interaction.reply({ content: 'VIP list updated successfully.', ephemeral: true });
    } catch (error) {
      console.error('Error occurred:', error);
      return interaction.reply({ content: 'An error occurred while updating the VIP list.', ephemeral: true });
    }
  },
  run: async (client, interaction) => {
    try {
      await module.exports.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '<:x_mark:1135925138764865566> - An error occurred while executing the command.', ephemeral: true });
    }
  }
};