const { CommandInteraction, Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Locks the channel to not allow users to send messages',
  options: [
    {
      name: 'channel',
      type: 'CHANNEL',
      description: 'The channel to lock',
      required: false,
    },
  ],
  async execute(interaction) {
    // Check if the user has the necessary permissions to manage channels
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
    }

    // Get the channel to unlock
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Check if the channel is already unlocked
    if (channel.permissionsFor(interaction.guild.roles.everyone).has(Permissions.FLAGS.SEND_MESSAGES) === false) {
      return interaction.reply({ content: 'The channel is already locked.', ephemeral: true });
    }

    // Unlock the channel
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SEND_MESSAGES: false,
    });

    // Send a confirmation message
    const embed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle('🔒 Channel Locked')
      .setDescription(`${channel} has been **locked** by <@${interaction.user.id}>.`);
    interaction.reply({ embeds: [embed] });
  },
  
  run: async (client, interaction) => {
    try {
      await module.exports.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  }
};