const { CommandInteraction, MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
name: 'botinfo',
description: 'Get information about the bot',
options: [],

run: async (client, interaction) => {
const uptime = moment.duration(client.uptime).humanize();
const days = moment.duration(client.uptime).days();
const hours = moment.duration(client.uptime).hours();
const minutes = moment.duration(client.uptime).minutes();
  let uptimeString = '';
if (days > 0) uptimeString += `${days} day${days > 1 ? 's' : ''}, `;
if (hours > 0) uptimeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
if (minutes > 0) uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
uptimeString = uptimeString.slice(0, -2); // Remove trailing comma and space

const totalGuilds = client.guilds.cache.size;
const totalUsers = client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0);
const totalChannels = client.channels.cache.size;

const botInfoEmbed = new MessageEmbed()
  .setTitle(`Bot Information`)
.setImage("https://media.discordapp.net/attachments/922939216109916170/1107998123177021530/INFOOO.png?width=392&height=60")
  .addField('<:icons_ping:1107995104758730886> Bot Name', `<:reply:1107319971694006314> <@${client.user.id}>`, true)
  .addField('<:icons_supportscommandsbadge:1107995169426526258> Bot Prefix', '<:reply:1107319971694006314> **/** (Slash Commands)', true)
  .addField('<:servers:1107994734875639848> Bot Servers', `<:reply:1107319971694006314> ${totalGuilds}`, true)
  .addField('<:botname:1107994586195959888> Bot Users', `<:reply:1107319971694006314> ${totalUsers}`, true)
  .addField('<:icons_channel:1107996205906133002> Bot Channels', `<:reply:1107319971694006314> ${totalChannels}`, true)
  .addField('<:icons_clock:1107995017462689842> Bot Uptime', `<:reply:1107319971694006314> ${uptimeString} (${uptime})`, true)
  .addField('<:nodejs:1107995416445853746> Node.js Version', `<:reply:1107319971694006314> ${process.version}`, true)
  .addField('<:djs:1107995370958626846> Discord.js Version', `<:reply:1107319971694006314> v${require('discord.js').version}`, true)
  .setColor('#4b5af9')
  .setTimestamp();

interaction.reply({ embeds: [botInfoEmbed] });
},
};