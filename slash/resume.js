const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: "resume",
    description: '▶ Resume a paused giveaway',

    options: [
        {
            name: 'giveaway',
            description: 'The giveaway to resume (message ID or giveaway prize)',
            type: 'STRING',
            required: true
        }
    ],

    run: async (client, interaction) => {

        // If the member doesn't have enough permissions
        if (!interaction.member.permissions.has('ManageMessages') && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
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

        if (!giveaway.pauseOptions.isPaused) {
     const ispausedEmbed = new MessageEmbed()
    .setTitle("<:error:1118280494497415189> | Not Paused!")
    .setDescription(`[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** is not paused!`)
    .setColor("#fa3e3e");

  return interaction.reply({ embeds: [ispausedEmbed], ephemeral: true });
}

        // Edit the giveaway
        client.giveawaysManager.unpause(giveaway.messageId)
            // Success message
            .then(() => {
    const pausedEmbed = new MessageEmbed()
      .setTitle("<:resume:1118285294974795777> | Giveaway Resumed")
      .setDescription(`**[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has been successfully resumed!`)
      .setColor("#355bfa");

    interaction.reply({ embeds: [pausedEmbed], ephemeral: true });
  })
  .catch((e) => {
    const errorEmbed = new MessageEmbed()
      .setTitle("<:error:1118280494497415189> | Error")
      .setDescription(`An error occurred while trying to resume the giveaway:\n\`\`\`ansi[1;2m[1;31m${e}[0m[0m[2;31m[0m\`\`\``)
      .setColor("#fa3e3e");
});

    }
};

