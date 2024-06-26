const fs = require('fs');
const schedule = require('node-schedule');
const path = require('path');
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const { MessageEmbed } = require('discord.js');

client.ws.on('VOICE_SERVER_TYPING', () => {}); 
function loadUserData() {
  try {
    const userData = fs.readFileSync('userdata.json');
    return JSON.parse(userData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Error loading user data:', error);
    return {};
  }
}

function saveUserData(userData) {
  try {
    fs.writeFileSync('userdata.json', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

function getUserCredits(userData, userId) {
  return userData[userId] ? userData[userId].credits : 0;
}

function updateUserCredits(userData, userId, credits) {
  if (!userData[userId]) {
    userData[userId] = {};
  }
  userData[userId].credits = credits;
  saveUserData(userData);
}

function getVIPServers() {
  try {
    const vipServersData = fs.readFileSync(path.join('storage', 'vip_servers.json'));
    return JSON.parse(vipServersData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error loading VIP servers:', error);
    return [];
  }
}

function saveVIPServers(vipServers) {
  try {
    fs.writeFileSync(path.join('storage', 'vip_servers.json'), JSON.stringify(vipServers));
  } catch (error) {
    console.error('Error saving VIP servers:', error);
  }
}

module.exports = {
  name: 'premium',
  description: 'Purchase premium server status',
  options: [
    {
      name: 'server',
      description: 'Server ID',
      type: 'STRING',
      required: true,
    },
  ],
  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.options.getString('server');
    const premiumPrice = 1000;
    const premiumDuration = 30; // 30 days

    // Load user data
    const userData = loadUserData();

    // Get user's credits
    const userCredits = getUserCredits(userData, userId);

    // Check if user has enough credits to purchase premium
    if (userCredits < premiumPrice) {
      return interaction.reply({ content: 'Insufficient credits to purchase premium server status.', ephemeral: true });
    }

    // Get the guild (server) the interaction was triggered in
    const server = interaction.guild;

    // Check if the server exists and the user executing the command is the server owner
    if (!server || server.ownerId !== userId) {
      return interaction.reply({ content: 'You can only purchase premium server status for your own server.', ephemeral: true });
    }

    // Load VIP servers
    const vipServers = getVIPServers();

    // Check if the server is already a VIP server
    if (vipServers.includes(serverId)) {
      return interaction.reply({ content: 'This server is already a premium server.', ephemeral: true });
    }

    // Deduct credits from user's balance
    const newCredits = userCredits - premiumPrice;
    updateUserCredits(userData, userId, newCredits);

    // Transfer credits to the user with ID: 760538995649282140
    const receiverId = '760538995649282140';
    const receiverCredits = getUserCredits(userData, receiverId);
    const newReceiverCredits = receiverCredits + premiumPrice;
    updateUserCredits(userData, receiverId, newReceiverCredits);

    // Add the server to VIP servers
    vipServers.push(serverId);
    saveVIPServers(vipServers);

    // Create an embed indicating that the server has been added to the VIP list
    const embed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle('<:check_mark:1135925135300366446> - Server Added to VIP List')
      .setDescription(`Server with ID \`${serverId}\` has been added to the VIP list by <@${interaction.user.id}>.`)
      .setThumbnail(server.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Server Name', value: server.name },
        { name: 'Server Owner', value: `<@${server.ownerId}>` },
        { name: 'Member Count', value: server.memberCount.toString() },
      );

  // Send DM to server owner indicating the addition of premium status
  const serverOwner = interaction.client.users.cache.get(server.ownerId);
  if (serverOwner) {
    serverOwner.send({ embeds: [embed] }).catch(console.error);
  }

  // Send the log message to the VIP log channel
  const vipLogChannel = interaction.client.channels.cache.get('1135365633400381540'); // Replace with the actual VIP log channel ID
  if (vipLogChannel && vipLogChannel.type === 'GUILD_TEXT') {
    vipLogChannel.send({ embeds: [embed] });
  }

  // Schedule the removal of premium status after the specified duration
  const removalDate = new Date();
  removalDate.setDate(removalDate.getDate() + premiumDuration);

  const job = schedule.scheduleJob(removalDate, () => {
    // Remove the server from VIP servers
    const index = vipServers.indexOf(serverId);
    if (index !== -1) {
      vipServers.splice(index, 1);
      saveVIPServers(vipServers);
    }

    // Create an embed indicating that the server has been removed from the VIP list
    const removeEmbed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('<:cross_mark:1135925135300366447> - Server Removed from VIP List')
      .setDescription(`Server with ID \`${serverId}\` has been removed from the VIP list after the premium duration ended.`)
      .setThumbnail(server.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Server Name', value: server.name },
        { name: 'Server Owner', value: `<@${server.ownerId}>` },
        { name: 'Member Count', value: server.memberCount.toString() },
      );

    // Send the removal log message to the VIP log channel
    if (vipLogChannel && vipLogChannel.type === 'GUILD_TEXT') {
      vipLogChannel.send({ embeds: [removeEmbed] });
    }

      // Send DM to server owner indicating the removal of premium status
      if (serverOwner) {
        serverOwner.send({ embeds: [removeEmbed] }).catch(console.error);
      }
    }, premiumDuration);

    interaction.reply({ embeds: [embed] });
  },
  run: async (client, interaction) => {
    try {
      await module.exports.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
  },
};