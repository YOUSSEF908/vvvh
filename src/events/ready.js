const { ActivityType } = require("discord.js")
const schema = require("../models/ticket")

module.exports = {
	name: 'ready',
	once: true,
	execute: async (client) => {
    
        setInterval(async() => {
            const data = await schema.find({ closed: false });         
            const count = data?.length || 0      
        
            const activities = [`${count} active ticket!`];          
            
            let activity = activities[Math.floor(Math.random() * activities.length)];
            client.user.setPresence({activities: [{name: activity, type: ActivityType.Watching }], status: "online"});  
        }, 20 * 1000);        
    }};
