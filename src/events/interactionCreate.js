const { EmbedBuilder, InteractionType } = require("discord.js");
const { QuickDB } = require("quick.db");
const { readdirSync } = require("fs");
const db = new QuickDB

 module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
  let client = interaction.client;
   if (interaction.type == InteractionType.ApplicationCommand) {
   if(interaction.user.bot) return;

	readdirSync('./src/commands').forEach(file => {
        const command = require(`../../src/commands/${file}`);
        if(interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
        command.run(interaction, client)
        db.add('total_command', 1)
        }
    })
   } else 
        
	if (interaction.isChatInputCommand()) {
		// command handling
	} else if (interaction.isAutocomplete()) {
		//const command = client.commands.get(interaction.commandName);
	     readdirSync('./src/commands').forEach( async file => {      
         const command = require(`../../src/commands/${file}`);       
         if(interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {     

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error)
		}
         }
	}) 
    }                                               
  }}
