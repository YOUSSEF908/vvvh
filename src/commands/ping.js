const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Pong 🏓"),
    run: async (interaction, client) => {
        
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setDescription(`Latecy: ${Date.now() - interaction.createdTimestamp}ms`)
        
        await interaction.reply({ content: 'Pong 🏓', embeds: [embed]})       
    }
}