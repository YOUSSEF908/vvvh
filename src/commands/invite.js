const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite Enterprise to your server."),
    run: async (interaction, client) => {
        
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(`Invite ${client.user.username}`)
            .setStyle(ButtonStyle.Link)
            .setURL(config.link.invite))
    
    let embed = new EmbedBuilder()
    .setDescription(`Click button to invite **${client.user.username}** to your server.`)
    .setColor(config.embed.color)
    
    interaction.reply({ embeds: [embed], components: [row] })
        
    }
}