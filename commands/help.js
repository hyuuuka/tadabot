process.on('unhandledRejection', () => { })

const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const config = require('../config.json');

module.exports.run = async (client, message, args) => {

  const embed = new MessageEmbed()
    .setTitle(`📨 TadaBot Help Command`)
    .setColor('#4b5af9')
    .setDescription(`<:add:922905572704137246> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.commands)** | <:helpcmd:922553170813677628> **[Support Server](https://discord.com/invite/zr8hRh5Snj)**
        
        **What is TadaBot** <:questionmark:922548262081286176> **TadaBot** is a an **Advanced Giveaway Manager** Bot built on discord.js, with a lot of functionable commands you can use to manage your server's Giveaways.

        **Please Select a category to view TadaBot commands!**`)
.setImage("https://media.discordapp.net/attachments/922939216109916170/1089636050411991160/image_1.png?width=512&height=128")

  const giveaway = new MessageEmbed()
    .setTitle(":tada: TadaBot's Giveaway Commands")
    .setColor('#4b5af9')
    .setDescription(`<:add:922905572704137246> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.commands)** | <:helpcmd:922553170813677628> **[Support Server](https://discord.com/invite/zr8hRh5Snj)**
  
  Here are the giveaway commands:

<:rarrow:926548862028644413> **/start or /create**
 To Start/Create a giveaway

<:rarrow:926548862028644413> **/edit**
Edit a specific giveaway

<:rarrow:926548862028644413> **/end**
To End a specific giveaway

<:rarrow:926548862028644413> **/reroll**
To Reroll and choose another winners in an specific ended giveaway`)
    .setTimestamp()


  const general = new MessageEmbed()
    .setTitle("<:Gearr:926546702511517727> TadaBot's General Commands")
    .setColor('#4b5af9')
    .setDescription(`<:add:922905572704137246> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.commands)** | <:helpcmd:922553170813677628> **[Support Server](https://discord.com/invite/zr8hRh5Snj)**
  
Here are the General commands:

<:rarrow:926548862028644413> **/help**
To Show all the commands

<:rarrow:926548862028644413> **/invite**
To Get our Bot Invite Link

<:rarrow:926548862028644413> **/ping**
To Check the bot's ping`)
    .setTimestamp()

  const components = (state) => [
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("help-menu")
        .setPlaceholder("Select a Category to show the commands")
        .setDisabled(state)
        .addOptions([{
          label: `Giveaways`,
          value: `giveaway`,
          description: `To see all the Giveaway commands!`,
          emoji: `🎉`
        },
        {
          label: `General`,
          value: `general`,
          description: `To see all the General commands!`,
          emoji: `⚙️`
        }
        ])
    ),
  ];

  const initialMessage = await message.reply({ embeds: [embed], components: components(false) });

  const filter = (interaction) => interaction.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector(
    {
      filter,
      componentType: "SELECT_MENU",
      time: 300000
    });

  collector.on('collect', (interaction) => {
    if (interaction.values[0] === "giveaway") {
      interaction.update({ embeds: [giveaway], components: components(false) });

    } else if (interaction.values[0] === "general") {
      interaction.update({ embeds: [general], components: components(false) });
    }
  });
  collector.on('end', () => {
    initialMessage.edit({ components: components(true) });
  }
  )
}
