const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("Gives information about user.")
    .addUserOption(option =>
		option
            .setName('user')
			.setDescription('Select the user whose information you want.')),
    run: async (interaction, client) => {
        
        const user = interaction.options.getUser("user") || interaction.user;
        
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setAuthor({ name: user.tag, iconURL: user.avatarURL({ dynamic: true }) })
        .setThumbnail(user.avatarURL({ dynamic: true }))
        .addFields(
            { name: "User Tag", value: user.tag },
            { name: "User ID", value: user.id },          
            { name: "User Joined Date (Discord)", value: `<t:${parseInt(user.createdTimestamp / 1000)}:f>` },
            { name: "User Badges", value: "\u200B"},
            { name: "Account Type", value: `${user.bot ? "Bot" : "User"}` }
        ) 
        
        interaction.reply({ embeds: [embed] })
    }
}