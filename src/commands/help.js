const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require("../config")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows the ♾️ Ticketing commands."),
    run: async (interaction, client) => {
          
        const latecy = `${Date.now() - interaction.createdTimestamp}ms`;
        const guildCount = client.guilds.cache.size.toLocaleString();
        const userCount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();
        
        const row = new ActionRowBuilder()
			.addComponents(
               new ButtonBuilder()
					.setCustomId('helpMenuHome')
					.setEmoji('<:emoji_47:1076079242883907634>')
                    .setDisabled(true)
					.setStyle(ButtonStyle.Secondary),  
                
				new ButtonBuilder()
					.setCustomId('helpMenuTicket')
					.setEmoji('<:emoji_48:1076131503572013086>')
					.setStyle(ButtonStyle.Secondary),
              
 				new ButtonBuilder()
					.setCustomId('helpMenuInfo')
					.setEmoji('<:emoji_46:1076079215620919296>')
					.setStyle(ButtonStyle.Secondary),             
			);
           
        const embed = new EmbedBuilder()
        .setTitle("♾️ Ticketing Help Menu")
        .setColor(config.embed.color)
        .setDescription(`• If you have a problem that you cannot solve, you can come to my [support server](${config.link.supportServer}).`)
        .addFields(
             { name: " Updates", value: "> undefined"},
             { name: " Bot Information", value: `> Latecy: ${latecy}\n> Guild Count: ${guildCount}\n> User Count: ${userCount}` },
             { name: " Tip", value: `>  Home Button\n> : Ticket Button\n> : Information Button` }                       
         )
        
        const ticketEmbed = new EmbedBuilder()
        .setTitle("♾️ Ticketing Help Menu")
        .setColor(config.embed.color)
        .setDescription(`• If you have a problem that you cannot solve, you can come to my [support server](${config.link.supportServer}).`)
        .addFields(
             { name: " Updates", value: "> update every weekend "},
             { name: " Ticket Commands", value: "> /ticket setup\n> /ticket user add\n> /ticket user remove" },
         )
        
        const infoEmbed = new EmbedBuilder()
        .setTitle("♾️ Ticketing Help Menu")
        .setColor(config.embed.color)
        .setDescription(`• If you have a problem that you cannot solve, you can come to my [support server](${config.link.supportServer}).`)
        .addFields(
             { name: "<:icons_new1A:1054323233748426813><:icons_new2A:1054323234981552148> Updates", value: "> update every weekend"},
             { name: " Info Commands", value: "> /bot-info\n> /help\n> /invite\n> /ping\n> /support\n> /user-info" },
         )       
            
       const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
        
       const collector = interaction.channel.createMessageComponentCollector({ time: 120 * 1000 });       
        
        collector.on('collect', async i => {
            if (i.customId === 'helpMenuHome') {
                    let components = [];
                components.push(
                    ButtonBuilder.from(row.components[0]).setDisabled(true),
                    ButtonBuilder.from(row.components[1]).setDisabled(false),
                    ButtonBuilder.from(row.components[2]).setDisabled(false)                    
                );
                
                const row2 = new ActionRowBuilder().addComponents(components);  
                
                await i.update({ embeds: [embed], components: [row2] });
            } else
                
             if (i.customId === 'helpMenuTicket') {
                 let components = [];               
                components.push(
                    ButtonBuilder.from(row.components[0]).setDisabled(false),
                    ButtonBuilder.from(row.components[1]).setDisabled(true),
                    ButtonBuilder.from(row.components[2]).setDisabled(false)                    
                );
                 
                const row2 = new ActionRowBuilder().addComponents(components);  
                 
                await i.update({ embeds: [ticketEmbed], components: [row2] });
            } 
            if (i.customId === 'helpMenuInfo') {
                 let components = [];               
                components.push(
                    ButtonBuilder.from(row.components[0]).setDisabled(false),
                    ButtonBuilder.from(row.components[1]).setDisabled(false),
                    ButtonBuilder.from(row.components[2]).setDisabled(true)                    
                );
                
                const row2 = new ActionRowBuilder().addComponents(components);  
                
                await i.update({ embeds: [infoEmbed], components: [row2] });
            }             
        });
      
        collector.on('end', async () => {
            message.edit({ content: "❗ Components are expired!", components: []})
        });
        
    }
}
