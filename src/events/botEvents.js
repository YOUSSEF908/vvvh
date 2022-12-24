const dataGuild = require("../models/ticketSetup");
const dataTicket = require("../models/ticket");

// Ticket & Ticket Setup Channel Delete

module.exports = {
	name: 'channelDelete',
	execute: async(channel) => {
        
        const dbGuild = await dataGuild.find({ channelId: channel.id })
        const dbTicket = await dataTicket.find({ channelId: channel.id })        
        
        if(dbGuild) {
            await dataGuild.deleteOne({ channelId: channel.id })          
        }
        
        if(dbTicket) {
            dataTicket.deleteOne({ channelId: channel.id })
        }        
        
    }
 }

// Ticket Guild Delete

module.exports = {
	name: 'channelDelete',
	execute: async(channel) => {
       
        if (channel.type === 'GuildCategory') return;
        
        const dbGuild = await dataGuild.find({ categoryId: channel.id })
        
        if(dbGuild) {
            await dataGuild.deleteMany({ categoryId: channel.id })          
        }        

    }
}

// Ticket Setup Message Delete

module.exports = {
	name: 'messageDelete',
	execute: async(message) => {
        
        const dbGuild = await dataGuild.find({ categoryId: message.id })
        
        if(dbGuild) {
            await dataGuild.deleteOne({ categoryId: message.id })          
        }        

    }
}
        

        
