const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'To Invite our bot to your server',
    run: async (client, interaction) => {
    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setLabel(`Invite ${client.user.username}`)
        .setStyle('LINK')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`),
        new MessageButton()
        .setLabel('Support Server')
        .setStyle('LINK')
        .setURL("https://discord.gg/eW5guZa63e"),
    )
    let invite = new MessageEmbed()
   .setTitle(`Invite ${client.user.username} & Join Our Support Server!`)
    .setColor('#4b5af9')
    .setTimestamp()
    interaction.reply({ embeds: [invite], components: [row]});
}
}
