
import keep_alive from './keep_alive.js';

const express = require("express");
const app = express();
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js")

const axios = require('axios');
const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
const fs = require("fs");
const moment = require('moment');
const config = require("./config.json");
const fetch = require('node-fetch');
const prefix = "tb!"
client.config = config;

// Initialise discord giveaways
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./storage/giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: "#2F3136",
    reaction: "🎉",
    hostedBy: "Hosted by: {this.hostedBy}",
    lastChance: {
      enabled: true,
      content: `💥 **LAST CHANCE TO ENTER** 💥`,
      threshold: 5000,
      hostedBy: "Hosted by: {this.hostedBy}",
      embedColor: '#FF0F0F'
    }
  }
});


/* Load all events (discord based) */


fs.readdir("./events/discord", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   ✅  Loaded: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

/* Load all events (giveaways based) */


fs.readdir("./events/giveaways", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[Event]   🎉 Loaded: ${eventName}`);
    client.giveawaysManager.on(eventName, (...file) => event.execute(...file, client)), delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  })
})

// Let commands be a new collection ( message commands )
client.commands = new Discord.Collection();
/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, {
      name: commandName,
      ...props
    });
    console.log(`[Command] ✅  Loaded: ${commandName}`);
  });
});

// let interactions be a new collection ( slash commands  )
client.interactions = new Discord.Collection();
// creating an empty array for registering slash commands
client.register_arr = []
/* Load all slash commands */
fs.readdir("./slash/", (_err, files) => {
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props
    });
    client.register_arr.push(props)
  });
});

const https = require('https');
const userDataPath = './userdata.json';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Guild Join

client.on("guildCreate", async (guild) => {
  let log = await client.channels.fetch('922939383223562290');

  const members = guild.members.cache;
  const channels = guild.channels.cache;
  const emojis = guild.emojis.cache;
  const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

  // Get the server owner's information
  const owner = await guild.fetchOwner();
  const ownerMention = owner.user.toString();
  const ownerId = owner.id;

  let embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setTitle("<:join:1118285173574860883> I have Joined a New Server")
    .setDescription(`<:card:1118280383990075402> **__Guild Information:__** 
<:8759855159486792083:1088938252179865610> Guild Name: **${guild.name}** (**${guild.id}**)
<:8759855159486792083:1088938252179865610> Guild Owner: ${ownerMention} (**\`${ownerId}\`**)
<:8759855159486792083:1088938252179865610> Guild Created At: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>
<:8759855159486792083:1088938252179865610> Guild Members Count: ${guild.memberCount}
<:8759855159486792084:1088938248958652496> Guild Roles Count: ${roles.length}

<:card:1118280383990075402> Guild Emojis:
<:8759855159486792083:1088938252179865610> Emoji Count: ${emojis.size}
<:8759855159486792083:1088938252179865610> Normal Emoji Count: ${emojis.filter(emoji => !emoji.animated).size}
<:8759855159486792084:1088938248958652496> Animated Emoji Count: ${emojis.filter(emoji => emoji.animated).size}

<:card:1118280383990075402> Other Guild Information:
<:8759855159486792083:1088938252179865610> Server Verification Level: ${guild.verificationLevel}
<:8759855159486792084:1088938248958652496> Bot Servers: ${client.guilds.cache.size}`)
    .setTimestamp();
  log.send({ embeds: [embed] });
});
// Guild Leave

client.on("guildDelete", async guild => {

  let log = await client.channels.fetch('922939383223562290');

  const members = guild.members.cache;
  const channels = guild.channels.cache;
  const emojis = guild.emojis.cache;
  const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);

  // Get the server owner's information
  const owner = await guild.fetchOwner();
  const ownerMention = owner.user.toString();
  const ownerId = owner.id;

  let embed = new Discord.MessageEmbed()
    .setColor('RED')
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setTitle("<:leave:1118285189970415668>  I have Left a New Server")
    .setDescription(`<:card:1118280383990075402> **__Guild Information:__** 
<:8759855159486792083:1088938252179865610> Guild Name: **${guild.name}** (**${guild.id}**)
<:8759855159486792083:1088938252179865610> Guild Owner: ${ownerMention} (**\`${ownerId}\`**)
<:8759855159486792083:1088938252179865610> Guild Created At: <t:${Math.floor(guild.createdTimestamp / 1000)}:R>
<:8759855159486792083:1088938252179865610> Guild Members Count: ${guild.memberCount}
<:8759855159486792084:1088938248958652496> Guild Roles Count: ${roles.length}

<:card:1118280383990075402> Guild Emojis:
<:8759855159486792083:1088938252179865610> Emoji Count: ${emojis.size}
<:8759855159486792083:1088938252179865610> Normal Emoji Count: ${emojis.filter(emoji => !emoji.animated).size}
<:8759855159486792084:1088938248958652496> Animated Emoji Count: ${emojis.filter(emoji => emoji.animated).size}

<:card:1118280383990075402> Other Guild Information:
<:8759855159486792083:1088938252179865610> Server Verification Level: ${guild.verificationLevel}
<:8759855159486792084:1088938248958652496> Bot Servers: ${client.guilds.cache.size}`)
    .setTimestamp();
  log.send({ embeds: [embed] });
});

client.on('guildCreate', async (guild) => {
  const owner = await guild.fetchOwner();
  if (owner) {

    const embed = new MessageEmbed()
      .setTitle('Thank you for inviting me! ✨')
      .setDescription(`Hello ${owner.user.username}, TadaBot is an advanced and powerful giveaway bot designed to help server administrators and moderators manage giveaways and engage with their community. With its robust features and user-friendly interface, TadaBot simplifies the process of hosting and organizing giveaways, making it an essential tool for any server looking to provide exciting events and rewards to its members.

The bot brings excitement and interactivity to any server through its advanced giveaway management capabilities. Its customizable features and integration with server economies make it an invaluable tool for server administrators seeking to engage their community and provide rewarding experiences.`)
      .setColor('#4b5af9') 
.setImage('https://media.discordapp.net/attachments/922939216109916170/1089636050411991160/image_1.png?ex=65a439a6&is=6591c4a6&hm=a883f0e5b07b36914bae007632dd605ab0fecf4fa530277ff07921615616db3a&=&format=webp&quality=lossless');

    const documentationButton = new MessageButton()
      .setLabel('Terms of Service')
      .setStyle('LINK')
     .setURL('https://tadabot.gitbook.io/terms-of-service/');

    const row = new MessageActionRow().addComponents(documentationButton);

    owner.send({ embeds: [embed], components: [row] })
      .then(() => {
        //Do something after sending the DM
      })
      .catch(console.error);
  }
});

const cooldownDuration = 2 * 60 * 1000; // 2 minutes cooldown duration in milliseconds

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  const userId = message.author.id;
  const userDataPath = './userdata.json';

  // Load user data from the userdata.json file
  let userData = {};
  if (fs.existsSync(userDataPath)) {
    userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));
  }

  const currentTimeStamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

  if (userData[userId] && userData[userId].lastDailyTimestamp) {
    const lastDailyTimestamp = userData[userId].lastDailyTimestamp;

    // Check if the cooldown period has passed
    if (currentTimeStamp - lastDailyTimestamp < cooldownDuration / 1000) {
      return; // Cooldown period not passed, ignore the message
    }
  }

  // Generate a random number between 5 and 20 for the credits
  const creditsToAdd = Math.floor(Math.random() * (20 - 5 + 1)) + 5;

  if (!userData[userId]) {
    // If user data doesn't exist, create a new entry
    userData[userId] = {
      credits: creditsToAdd,
      lastDailyTimestamp: currentTimeStamp,
    };
  } else {
    // Update the credits and lastDailyTimestamp in the user data
    userData[userId].credits += creditsToAdd;
    userData[userId].lastDailyTimestamp = currentTimeStamp;
  }

  // Save the updated user data back to the userdata.json file
  fs.writeFileSync(userDataPath, JSON.stringify(userData));

  const user = message.author;
  const username = user.username;

  console.log(`Added ${creditsToAdd} credits to ${username}'s account (ID: ${userId}).`);
});

const { Permissions } = require('discord.js');

// Helper function to parse ban duration
function parseDuration(time) {
  const durationRegex = /^(\d+)([hdwmy])$/;
  const matches = durationRegex.exec(time);

  if (matches) {
    const value = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'w':
        return value * 7 * 24 * 60 * 60 * 1000;
      case 'm':
        return value * 30 * 24 * 60 * 60 * 1000;
      case 'y':
        return value * 365 * 24 * 60 * 60 * 1000;
    }
  }

  return null;
}

client.on('warn', (info) => {
  console.warn('Warning:', info);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.token);
keepAlive();
