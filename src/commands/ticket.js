const { EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
const Schema = require("../models/ticketSetup");
const ticketSchema = require("../models/ticket");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Setting a ticket.")
    .addSubcommand(subcommand => {
        return subcommand
          .setName('setup')
          .setDescription('Temporary bans a user')
          .addChannelOption(option => {
              return option
                  .setName("channel")
                  .setDescription("Text channel where the ticket message will be sent.")
                  .addChannelTypes(ChannelType.GuildText)        
                  .setRequired(true);
    })
          .addChannelOption(option => {
              return option
                  .setName("category")
                  .setDescription("The category in which the ticket channels will be created.")
                  .addChannelTypes(ChannelType.GuildCategory)        
                  .setRequired(true);
    })
          .addRoleOption(option => {
              return option
                  .setName("author-role")
                  .setDescription("Authorized role that deals with tickets.")
                  .setRequired(true);        
    })    
          .addStringOption(option => {
              return option
                  .setName("embed-message")
                  .setDescription("Message of embed.")
                  .setMaxLength(4000)
                  .setRequired(false);        
    }) 
          .addStringOption(option => {
              return option
                  .setName("embed-color")
                  .setDescription("Color of embed.")
                  .setRequired(false);        
    })     
          .addStringOption(option => {
              return option
                  .setName("button-message")
                  .setDescription("Message of button.")
                  .setMaxLength(50)
                  .setRequired(false);        
    })        
          .addStringOption(option => {
              return option
                  .setName("button-color")
                  .setDescription("Color of button.")
                  .addChoices(
                      { name: 'Blue', value: 'Primary' }, 
                      { name: 'Red', value: 'Danger' },
				      { name: 'Gray', value: 'Secondary' },
				      { name: 'Green', value: 'Success' })
                  .setRequired(false);        
          })
    })
    .addSubcommandGroup(group => {
        return group
            .setName('user')
            .setDescription('group a')
            .addSubcommand(subcommand => {
                return subcommand
                    .setName('add')
                    .setDescription('Temporary bans a user')
                    .addUserOption(option => {
                        return option
                            .setName("user")
                            .setDescription("user")
                            .setRequired(true);                                         
                })
            .addChannelOption(option => {
                return option
                    .setName("channel")
                    .setDescription("Text channel where the ticket message will be sent.")
                    .addChannelTypes(ChannelType.GuildText)        
                    .setRequired(true);
    })            
        })
            .addSubcommand(subcommand => {
                return subcommand
                    .setName('remove')
                    .setDescription('Temporary bans a user')
                    .addUserOption(option => {
                        return option
                            .setName("user")
                            .setDescription("user")
                            .setRequired(true);                                         
                })
            .addChannelOption(option => {
                return option
                    .setName("channel")
                    .setDescription("Text channel where the ticket message will be sent.")
                    .addChannelTypes(ChannelType.GuildText)        
                    .setRequired(true);
    })            
        })        
    }),
    run: async (interaction, client) => {
        
        if (interaction.options.getSubcommand() === 'setup') {
            
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            interaction.reply({ content: `You don't have \`ManageChannels\` permission to use this command!` })           
        }            
            
        const channel = interaction.options.getChannel("channel");      
        const category = interaction.options.getChannel("category");
        const authorRole = interaction.options.getRole("author-role");
        const embedMessage = interaction.options.getString("embed-message") || "Click on the button below to create a ticket";
        const embedColor = interaction.options.getString("embed-color") || config.embed.color;
        const buttonMessage = interaction.options.getString("button-message") || "📩 Create Ticket";
        const buttonColor = interaction.options.getString("button-color") || "Primary";       
        
        const color = embedColor.replace("#", "");
        if (!/^[0-9A-F]{6}$/i.test(color)) return interaction.reply({ content: "Please provide a valid hex color", ephemeral: true });
        
        const embed = new EmbedBuilder()
        .setTitle('🎫 Ticket System')
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
        .setDescription(embedMessage)
        .setColor(embedColor)
        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
        .setTimestamp();        
 
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel(buttonMessage)
                    .setStyle(buttonColor)
            );
        
        await interaction.reply({ content: 'The ticket system has been setup', ephemeral: true });        
        
        await channel.send({ embeds: [embed], components: [row] }).then((message) => {
            
            new Schema({
                categoryId: category.id,
                guildId: interaction.guild.id,
                channelId: channel.id,
                messageId: message.id,
                authorRoleId: authorRole.id,
                embedColor: embedColor
            }).save()       
        })
        } else if (interaction.options.getSubcommand() === 'add') {
            
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMembers)) {
                interaction.reply({ content: `You don't have \`ManageMembers\` permission to use this command!` })
            }
            
            const user = interaction.options.getUser("user");
            const channel = interaction.options.getChannel("channel");          
            const data = await ticketSchema.findOne({ channelId: channel.id })
            
            if (!data) {
                interaction.reply({ content: `Your entered ticket channel has not found!`, ephemeral: true })
            }
            
            channel.permissionOverwrites.edit(user.id, {
                SendMessages: true,
                ViewChannel: true
            });
            
            await interaction.reply({ content: `User ${user} has been successfully added to the ticket.`, ephemeral: true })        
        
        } else if (interaction.options.getSubcommand() === 'remove') {
            
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMembers)) {
                interaction.reply({ content: `You don't have \`ManageMembers\` permission to use this command!` })
            }
            
            const user = interaction.options.getUser("user");
            const channel = interaction.options.getChannel("channel");          
            const data = await ticketSchema.findOne({ channelId: channel.id })
            
            if (!data) {
                interaction.reply({ content: `Your entered ticket channel has not found!`, ephemeral: true })
            }
            
            channel.permissionOverwrites.edit(user.id, {
                SendMessages: false,
                ViewChannel: false
            });
            
            await interaction.reply({ content: `User ${user} has been successfully removed to the ticket.`, ephemeral: true })
        }        
    }
}
