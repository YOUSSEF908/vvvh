const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("laws")
    .setDescription("Show Enterprise support server."),
    run: async (interaction, client) => {
        
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setDescription(`** ♾️ Ticketing Rules**

 > 1 - +18 / Do not share NSFW content.
  > 2 - Avoid matters involving harm, damage or death.
  > 3 - Do not discriminate.
  > 4 - Do not use channels unnecessarily.
  > 5 - Do not use spam, floods, unnecessary spoilers or too many capital letters.
  > 6 - Avoid fights, everyone will be punished, whatever the reason.
  > 7 - Do not use profanity for anyone.
 > 8 - Do not tag roles, members or senior people for no reason.
  > 9 - Do not share anyone's personal information in public.

 **Everyone who joins the server is deemed to have read and accepted the rules!**`)
        await interaction.reply({ content: '', embeds: [embed]})       
    }
}
