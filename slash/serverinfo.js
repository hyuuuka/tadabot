const { CommandInteraction, Permissions, MessageEmbed, Collection } = require('discord.js');

const verificationLevels = {
  NONE: 'None',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  VERY_HIGH: 'Very High'
};

const verificationLevelsEmojis = {
  NONE: '<:tb_none:1125427805551853589>',
  LOW: '<:tb_low:1125427799000363200>',
  MEDIUM: '<:tb_medium:1125427793090596874>',
  HIGH: '<:tb_high:1125427785821847572>',
  VERY_HIGH: '<:tb_very_high:1125427779731730572>'
};

const cooldowns = new Collection();

module.exports = {
  name: 'serverinfo',
  description: 'Displays information about the server',
  cooldown: 10, // Cooldown in seconds

  async execute(interaction) {
    const guild = interaction.guild;
    const roles = guild.roles.cache
      .filter(role => !role.managed && role.name !== '@everyone')
      .map(role => role.name)
      .join(', ');

    const rolesCount = guild.roles.cache.filter(role => !role.managed && role.name !== '@everyone').size;

    const embed = new MessageEmbed()
      .setColor('#4b5af9')
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setTitle(`Server Information`)
      .addFields(
        { name: '<:tb_server_owner:1125421211833348126> Owner', value: `<@${guild.ownerId}>` || 'Unknown', inline: true },
        { name: '<:tb_members:1125421206837940306> Members', value: `${guild.memberCount || 'Unknown'}`, inline: true },
        { name: '<:tb_serverboosts:1125421190358507662> Server Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true },
        { name: '<:tb_text_channels:1125421180631924836> Text Channels', value: `${guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size || 0}`, inline: true },
        { name: '<:tb_voice_channels:1125421171819675658> Voice Channels', value: `${guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size || 0}`, inline: true },
        { name: '<:tb_roles:1125421203163717632> Roles', value: `${roles || 'None'} (${rolesCount || 0})`, inline: true },
        { name: `${verificationLevelsEmojis[guild.verificationLevel]} Verification Level`, value: `${verificationLevels[guild.verificationLevel]}`, inline: true },
      )
      .setThumbnail(guild.iconURL({ dynamic: true }));

    interaction.reply({ embeds: [embed] });
  },

  async run(client, interaction) {
    try {
      const { user } = interaction;
      const commandName = this.name;

      // Check if the user is on cooldown
      if (!cooldowns.has(user.id)) {
        // User is not on cooldown, so add them to the cooldowns collection
        cooldowns.set(user.id, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(user.id);
      const cooldownAmount = (this.cooldown || 3) * 1000; // Default cooldown: 3 seconds

      if (timestamps.has(commandName)) {
        const expirationTime = timestamps.get(commandName) + cooldownAmount;

        if (now < expirationTime) {
          // User is still on cooldown
          const timeLeft = (expirationTime - now) / 1000;

          const cooldownEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${commandName}\` command.`);

          await interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
          return;
        }
      }

      // Execute the command
      await this.execute(interaction);

      // Update the timestamps for the user
      timestamps.set(commandName, now);
      setTimeout(() => timestamps.delete(commandName), cooldownAmount);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  }
};
