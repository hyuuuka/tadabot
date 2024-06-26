const { CommandInteraction, MessageEmbed } = require('discord.js');
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

module.exports = {
  name: 'coins',
  description: 'Check your coins',
  options: [
    {
      name: 'user',
      description: 'The user to check coins for',
      type: 'USER',
      required: false,
    },
  ],
  async execute(interaction) {
    const userId = interaction.options.getUser('user')?.id || interaction.user.id;
    const userData = loadUserData();
    const credits = getUserCredits(userData, userId);

    const embed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle(':coin: | Coins')
      .setDescription(`**<@${userId}> has \`${credits}\` coins.**`);

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