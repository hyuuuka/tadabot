const { MessageEmbed } = require("discord.js");
const fs = require("fs");

// Function to load user data from the JSON file
function loadUserData() {
  try {
    const userData = fs.readFileSync("userdata.json");
    return JSON.parse(userData);
  } catch (error) {
    // If the file doesn't exist, return an empty object
    if (error.code === "ENOENT") {
      return {};
    }
    console.error("Error loading user data:", error);
    return {};
  }
}

async function getTopUsers(client, userData, count = 5) {
  const sortedUsers = Object.entries(userData)
    .sort(([, user1], [, user2]) => user2.credits - user1.credits)
    .slice(0, count);

  const topUsers = [];

  for (const [userId, user] of sortedUsers) {
    try {
      const member = await client.users.fetch(userId);
      topUsers.push({
        userId,
        user: { ...user, member },
      });
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
    }
  }

  return topUsers;
}

module.exports = {
  name: "leaderboard",
  description: "Display the leaderboard",
  async execute(client, interaction) {
    try {
      const userData = loadUserData();
      const topUsers = await getTopUsers(client, userData, 5);

      // Create the leaderboard description
      let leaderboardDescription = "Top 5 users with the most credits:\n\n";
      for (let i = 0; i < topUsers.length; i++) {
        const { userId, user } = topUsers[i];
        const mentionedUser = user.member ? `<@${user.member.id}>` : `<@${userId}>`;
        leaderboardDescription += `${i + 1}. ${mentionedUser} **- \`${user.credits}\` Coins :coin:**\n`;
      }

      // Create a new embed
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Leaderboard")
        .setDescription(leaderboardDescription);

      if (interaction.replied) {
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
    }
  },

  async run(client, interaction) {
    try {
      await module.exports.execute(client, interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
    }
  },
};