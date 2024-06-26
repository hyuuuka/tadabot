const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
  name: 'help',
  description: 'To View all the commands of the bot!',
  cooldown: 5,
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle(`<:tadabot:1118285614815649932> TadaBot Commands`)
      .setColor('#366afb')
      .setDescription(`<:join:1118285173574860883> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.commands)** | <:support:1118285598097154069>  **[Support Server](https://discord.gg/eW5guZa63e)**

        **What is TadaBot** <:questionmark:1118285265828577281>
<:tadabot:1118285614815649932> **TadaBot** is an excellent bot to manage your server's giveaways.
This **easy-to-use** tool comes with many amazing features that makes it perfect for users of any level.


        <:rarrow:1118285281066487828> **Please Select a category to view all of the other categories and different Commands.**`)
      .setImage("https://media.discordapp.net/attachments/922939216109916170/1089636050411991160/image_1.png?width=512&height=128")
      .setTimestamp()

    const giveaway = new MessageEmbed()
      .setTitle(":tada: TadaBot's Giveaway Commands")
      .setColor('#366afb')
      .setDescription(`<:join:1118285173574860883> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.command)** | <:support:1118285598097154069> **[Support Server](https://discord.gg/eW5guZa63e)**

  Here are the giveaway commands:

<:rarrow:1118285281066487828> **/start or create**
      <:sub_message:1118285349882437632> To Start/Create a giveaway

<:rarrow:1118285281066487828> **/end**
     <:sub_message:1118285349882437632> To End a specific giveaway

<:rarrow:1118285281066487828> **/pause** <:premium:1135925170868076706>
     <:sub_message:1118285349882437632> To Pause a specific giveaway to never end

<:rarrow:1118285281066487828> **/resume** <:premium:1135925170868076706>
     <:sub_message:1118285349882437632> To Resume a specific giveaway that was already paused

<:rarrow:1118285281066487828> **/edit**
     <:sub_message:1118285349882437632> Edit a specific giveaway

<:rarrow:1118285281066487828> **/reroll**
     <:sub_message:1118285349882437632> To Reroll and choose another winners in an specific ended giveaway`)
      .setTimestamp();

    const general = new MessageEmbed()
      .setTitle("<:Gearr:926546702511517727> TadaBot's General Commands")
      .setColor('#366afb')
      .setDescription(`<:join:1118285173574860883> **[Invite TadaBot](https://discord.com/oauth2/authorize?client_id=862340553899507715&permissions=2147871840&scope=bot%20applications.command)** | <:support:1118285598097154069> **[Support Server](https://discord.gg/eW5guZa63e)**

Here are the General commands:
     
<:rarrow:1118285281066487828> **/coins**
   <:sub_message:1118285349882437632> To Check your coins

<:rarrow:1118285281066487828> **/daily**
  <:sub_message:1118285349882437632> To get your daily coins

<:rarrow:1118285281066487828> **/transfer**
  <:sub_message:1118285349882437632> To transfer coins to another user

<:rarrow:1118285281066487828> **/leaderboard**
  <:sub_message:1118285349882437632> To get top 5 most people with the most coins 

<:rarrow:1118285281066487828> **/invite**
   <:sub_message:1118285349882437632> To Get our Bot Invite Link

<:rarrow:1118285281066487828> **/premium**
   <:sub_message:1118285349882437632> To Buy Premium version of TadaBot

<:rarrow:1118285281066487828> **/serverinfo**
   <:sub_message:1118285349882437632> To get information about the server

<:rarrow:1118285281066487828> **/userinfo**
  <:sub_message:1118285349882437632> To get info about a user

<:rarrow:1118285281066487828> **/botinfo**
   <:sub_message:1118285349882437632> To get information about the bot

<:rarrow:1118285281066487828> **/ping**
     <:sub_message:1118285349882437632> To Check the bot's ping`)

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Please Select a Category")
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
            emoji: `<:Gearr:926546702511517727>`
          }
          ])
      ),
    ];

    const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector(
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
  },
};