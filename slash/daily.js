const { MessageEmbed } = require('discord.js');
const fs = require('fs');

// Function to load user data from the JSON file
function loadUserData() {
  try {
    const userData = fs.readFileSync('userdata.json');
    return JSON.parse(userData);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('Error loading user data:', error);
    return {};
  }
}

// Function to save user data to the JSON file
function saveUserData(userData) {
  try {
    fs.writeFileSync('userdata.json', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Function to get user credits from the user data
function getUserCredits(userData, userId) {
  return userData[userId] ? userData[userId].credits : 0;
}

// Function to update user credits in the user data
function updateUserCredits(userData, userId, credits) {
  if (!userData[userId]) {
    userData[userId] = {};
  }
  userData[userId].credits = credits;
  saveUserData(userData);
}

// Function to get the last daily timestamp for a user
function getLastDailyTimestamp(userData, userId) {
  return userData[userId] ? userData[userId].lastDailyTimestamp : 0;
}

// Function to update the last daily timestamp for a user
function updateLastDailyTimestamp(userData, userId, timestamp) {
  if (!userData[userId]) {
    userData[userId] = {};
  }
  userData[userId].lastDailyTimestamp = timestamp;
  saveUserData(userData);
}

module.exports = {
  name: 'daily',
  description: 'Claim daily coins',
  async execute(interaction) {
    const userId = interaction.user.id;
    const minCredits = 35;
    const maxCredits = 100;
    const credits = Math.floor(Math.random() * (maxCredits - minCredits + 1) + minCredits);

    // Load user data from the JSON file
    const userData = loadUserData();

    // Get the user's current credits
    let userCredits = getUserCredits(userData, userId);

    // Get the last daily timestamp for the user
    const lastDailyTimestamp = getLastDailyTimestamp(userData, userId);

    // Calculate the current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Calculate the elapsed time since the last daily claim
    const elapsedTime = currentTimestamp - lastDailyTimestamp;

    // Check if the user is still on cooldown
    if (elapsedTime < 86400) { // 24 hours in seconds
      const remainingTime = 86400 - elapsedTime;

      // Calculate the remaining hours, minutes, and seconds
      let remainingHours = Math.floor(remainingTime / 3600);
      let remainingMinutes = Math.floor((remainingTime % 3600) / 60);
      let remainingSeconds = remainingTime % 60;

      // Handle cases where the remaining time crosses over to the next day
      if (remainingHours >= 24) {
        remainingHours = remainingHours % 24;
      }

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:cooldown:925335529157951548> | Daily Cooldown')
        .setDescription(`**You have already claimed your daily coins. Please wait \`${remainingHours}\` hours, \`${remainingMinutes}\` minutes, and \`${remainingSeconds}\` seconds before claiming again.**`);

      return interaction.reply({ embeds: [embed] });
    }

    // Add the daily credits to the user's current credits
    userCredits += credits;

    // Update user credits in the user data
    updateUserCredits(userData, userId, userCredits);

    // Update the last daily timestamp for the user
    updateLastDailyTimestamp(userData, userId, currentTimestamp);

    // Save the updated user data to the JSON file
    saveUserData(userData);

    const embed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle('💰 | Daily Coins')
      .setDescription(`You received \`${credits}\` coins as your daily reward.`);

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