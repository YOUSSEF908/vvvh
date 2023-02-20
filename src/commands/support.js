const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("started")
    .setDescription("Show ♾️ get started ."),
    run: async (interaction, client) => {
        
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setDescription(`♾️`)
        await interaction.reply({ content: '', embeds: [embed]})       
    }
}
