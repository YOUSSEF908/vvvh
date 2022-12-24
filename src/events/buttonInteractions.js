const { EmbedBuilder, 
       PermissionsBitField,
       ChannelType, 
       ActionRowBuilder, 
       ButtonBuilder, 
       ButtonStyle, 
       AttachmentBuilder } = require('discord.js');
const Schema = require("../models/ticketSetup");
const ticketSchema = require("../models/ticket");
const client = require("../../index")
const config = require("../config");
const fs = require('fs');
const { QuickDB } = require("quick.db")
const db = new QuickDB

module.exports = {
    name: 'interactionCreate',

    execute: async (interaction) => {

/*client.on("interactionCreate", async (client, interaction) => {*/


        const xEmbed = new EmbedBuilder()
        const client = interaction.client

        
        const user = interaction.user;
        const button = interaction.customId;       
        
      if (button == 'create_ticket') {
            
            const data = await Schema.findOne({ messageId: interaction.message.id })
            
            if (!data) {
                interaction.reply({ content: 'Something went wrong. Data has not found!', ephemeral: true })
            }
            
            await db.add(`${interaction.message.id}_count`, 1);
            
            const count = await db.get(`${interaction.message.id}_count`) || 0;
            
            await interaction.guild.channels.create({
                name: `ticket-${count}`,
                type: ChannelType.GuildText,
                parent: data.categoryId,
                topic: `${user.username} ${user.id}`,
                permissionOverwrites: [
                 {
                     id: interaction.guild.id,        
                     deny: [PermissionsBitField.Flags.ViewChannel]
                 },
                 {
                     id: interaction.user.id,
                     allow: [PermissionsBitField.Flags.ViewChannel]
                 },
                 {
                     id: data.authorRoleId,
                     allow: [PermissionsBitField.Flags.ViewChannel]
                 },                    
                ]
            }).then(async (channel) => {
            
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket System')
                .setDescription(`Hello <@${user.id}>, welcome to your ticket!\nPlease wait for authorities to reply.`)
                .setColor(data.embedColor)
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTimestamp();
            
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('📩 Close Ticket')
                        .setStyle(ButtonStyle.Danger)
                );

            await channel.send({ content: `<@&${data.authorRoleId}> <@${interaction.user.id}>`, embeds: [ticketEmbed], components: [row] }).then((message) => {
            new ticketSchema({
                channelId: channel.id,
                messageId: interaction.message.id,
                channelMessageId: message.id,
                userId: interaction.user.id,
                closed: false
            }).save()                        
            })
            await interaction.reply({ content: `✅ Your ticket has been created in ${channel}`, ephemeral: true });                            
            })          
        
      } else if (button == 'close_ticket') {
          
            const data = await ticketSchema.findOne({ channelId: interaction.channel.id })            
            
            if (!data) {
                interaction.reply({ content: 'Something went wrong. Data has not found!', ephemeral: true })
            }           
            
            if(data.closed == true) {
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("This ticket is already closed!")
                
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
          
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket System')
                .setDescription(`Hello <@${interaction.user.id}>, are you sure you want to close this ticket?`)
                .setColor('Red')
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_close_ticket')
                        .setLabel('✅ Confirm')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('cancel_close_ticket')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Danger)
                );
                
            await interaction.reply({ embeds: [ticketEmbed], components: [row] });
          
        } else if (button == 'confirm_close_ticket') {            
            const data = await ticketSchema.findOne({ channelId: interaction.channel.id })
            
            if (!data) {
                interaction.reply({ content: 'Something went wrong. Data has not found!', ephemeral: true })
            }
            
            const message = await interaction.channel.messages.fetch(data.channelMessageId);           
             if (!message) {
                interaction.channel.send({ content: 'Something went wrong. Data has not found!'})
            }
            
            const channel = interaction.channel;
            
            if(data.closed == true) {
                const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription("This ticket is already closed!")
         
                interaction.reply({ embeds: [embed], ephemeral: true });     
            }
         
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket System')
                .setDescription(`This ticket has been closed by <@${interaction.user.id}>.`)
                .setColor('#2f3136')
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_ticket')
                        .setLabel('🗑️ Delete Ticket')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('reopen_ticket')
                        .setLabel('🔓 Reopen Ticket')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('transcript_ticket')
                        .setLabel('📄 Transcript')
                        .setStyle(ButtonStyle.Primary)
                );

            await interaction.update({ embeds: [ticketEmbed], components: [row] });
            await message.edit({ embeds: [ticketEmbed], components: [] });
            
            await channel.permissionOverwrites.edit(data.userId, {
                SendMessages: false,
                ViewChannel: false
            });
            await ticketSchema.updateOne({ channelMessageId: interaction.message.reference?.messageId }, { closed: true });
        } else if (button == 'cancel_close_ticket') {            
            await interaction.deferUpdate()
            await interaction.deleteReply()
            
        } else if (button == 'delete_ticket') {
            const channel = interaction.channel;            
            const data = await ticketSchema.findOne({ channelId: interaction.channel.id })
            
            if (!data) {
                interaction.reply({ content: 'Something went wrong. Data has not found!', ephemeral: true })
            }            
            
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket System')
                .setDescription(`This ticket will be deleted in 10 seconds.`)
                .setColor('Red')
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.update({ embeds: [ticketEmbed], components: [] });
            setTimeout( async () => {
                await ticketSchema.deleteOne({ channelId: interaction.channel.id });
                await channel.delete();
            }, 10000); 
            
         } else if (button == 'reopen_ticket') {
            const data = await ticketSchema.findOne({ channelId: interaction.channel.id });
            if (!data) {
                interaction.reply({ content: 'Something went wrong. Data has not found!', ephemeral: true })
            }
            const guildData = await Schema.find({ messageId:  data.messageId });       
            const message = await interaction.channel.messages.fetch(data.channelMessageId);
            
            if(data.closed == false) {
                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("This ticket is already open!")           
                
                interaction.reply({ embeds: [embed], ephemeral: true });                     
        }         
                                  
            const ticketEmbed = new EmbedBuilder()
                .setTitle('🎫 Ticket System')
                .setDescription(`Hello <@${data.userId}>, your ticket has been reopened.\nPlease wait for authorities to reply.`)
                .setColor(guildData[0].embedColor)
                .setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTimestamp();             
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('📩 Close Ticket')
                        .setStyle(ButtonStyle.Danger)
                );

            await interaction.channel.permissionOverwrites.edit(data.userId, {
                SendMessages: true,
                ViewChannel: true             
             });
            await ticketSchema.updateOne({ channelMessageId: interaction.message.reference?.messageId }, { closed: false }); 
            await interaction.deferUpdate()
            await interaction.deleteReply()
            await message.edit({ embeds: [ticketEmbed], components: [row] });
        } else if (button == 'transcript_ticket') {            
            const channel = interaction.channel;
            const messages = await channel.messages.fetch();
            const contentHandler = `Transcript for ${channel.name} (${channel.id})\n\n`;
            const content = messages.map(m => `[${m.createdAt.toLocaleDateString()} ${m.createdAt.toLocaleTimeString()}] ${m.author.tag}: ${m.content}`).join('\n');

            const transcript = new AttachmentBuilder()
                .setName(`transcript-${channel.name}.txt`)
                .setFile(Buffer.from(contentHandler + content));
            
            await interaction.reply({ content: `Your transcript is ready.`, files: [transcript] });
        }
    }}