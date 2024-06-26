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

module.exports = {
  name: 'transfer',
  description: 'Transfer credits to another user',
  options: [
    {
      name: 'to',
      description: 'The user to transfer credits to',
      type: 'USER',
      required: true,
    },
    {
      name: 'amount',
      description: 'The amount of coins to transfer',
      type: 'INTEGER',
      required: true,
    },
  ],
  async execute(interaction) {
    const senderId = interaction.user.id;
    const recipientOption = interaction.options.get('recipient');
    const amountOption = interaction.options.get('amount');

    // Get the recipient's user ID from the interaction options
    const recipientId = recipientOption.user ? recipientOption.user.id : recipientOption.value;

    // Get the amount of credits to transfer from the interaction options
    const amount = amountOption.value;

    // Load user data from the JSON file
    const userData = loadUserData();

    // Get the sender's current credits
    let senderCredits = getUserCredits(userData, senderId);

    // Check if the sender has sufficient credits
    if (senderCredits < amount) {
      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle('<:x_mark:1135925138764865566> | Not Enough Coins')
        .setDescription(`**You only have \`${senderCredits}\`, you need at least \`${amount}\` coins to transfer.**`);

      return interaction.reply({ embeds: [embed] });
    }

    // Subtract the transferred credits from the sender's current credits
    senderCredits -= amount;

    // Update sender credits in the user data
    updateUserCredits(userData, senderId, senderCredits);

    // Get the recipient's current credits
    let recipientCredits = getUserCredits(userData, recipientId);

    // Add the transferred credits to the recipient's current credits
    recipientCredits += amount;

    // Update recipient credits in the user data
    updateUserCredits(userData, recipientId, recipientCredits);

    // Save the updated user data to the JSON file
    saveUserData(userData);

    const senderEmbed  = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle('💸 | Transfer')
      .setDescription(`**<@${senderId}>, has transferred \`${amount}\` coins to <@${recipientId}>**.`);

    const recipientEmbed = new MessageEmbed()
      .setColor('#4b5af9')
      .setTitle('🧾 | Transfer Receipt')
      .setDescription(`**<@${senderId}> has transferred \`${amount}\` coins to you**.`);

    await interaction.reply({ embeds: [senderEmbed] });

    // Send receipt to the recipient
    const recipientUser = await interaction.client.users.fetch(recipientId);
    if (recipientUser) {
      recipientUser.send({ embeds: [recipientEmbed] }).catch(console.error);
    }
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