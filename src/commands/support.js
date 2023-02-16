const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("started")
    .setDescription("Show Enterprise support server."),
    run: async (interaction, client) => {
        
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setDescription(`Get started using the bot by [inviting](https://discord.com/oauth2/authorize?client_id=1071804169540878387&permissions=8&scope=bot%20applications.commands) the bot to your server.
You can use the (/ticket setup) to easily config the bot.
if you have any bug or technical issues you can <#1071877395428167700> us.
If you have any difficulties while using our bot ask the support for help.`)
        await interaction.reply({ content: '', embeds: [embed]})       
    }
}
