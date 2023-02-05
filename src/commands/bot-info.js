const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const package = require('../../package.json');
const { QuickDB } = require("quick.db");
const config = require("../config");
require('moment-duration-format');
const moment = require("moment");
const os = require("os");
const db = new QuickDB;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot-info")
    .setDescription("Shows statistics information about the bot."),
    run: async (interaction, client) => {
        
        const uptime = moment
        .duration(client.uptime)
        .format(` D [Day], H [Hour], m [Minute], s [Second]`);
       
        const uptime2 = `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`;
        const mongoose = package.dependencies.mongoose.replace("^", "");              
        const latecy = `${Date.now() - interaction.createdTimestamp}ms`;
        const api_latecy = `${Math.round(client.ws.ping)}ms`;
        const servers = `${client.guilds.cache.size.toLocaleString()}`;
        const users = `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`;
        const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}`;
        const cpu = `${os.cpus().map(i => `${i.model}`)[0]}`;
        const totalCommand = await db.get("total_command") || 0;
     
        const embed = new EmbedBuilder()
        .setColor(config.embed.color)
        .setThumbnail(client.user.avatarURL({dynamic:true}))
        .setAuthor({ name: `${client.user.username} | Bot Info`, iconURL: client.user.avatarURL() })
        .addFields(
            { name: ' System', value: `> Uptime: ${uptime2}\n> Ram: \`\`${ram}\`\`\n> CPU: \`\`${cpu}\`\`\n> Total Command Using: ${totalCommand}\n` },
            { name: ' General', value: `> Servers: \`\`${servers}\`\`\n> Users: \`\`${users}\`\`` },       
		    { name: ' Latecy', value: `> Latecy: \`\`${latecy}\`\`\n> API Latecy: \`\`${api_latecy}\`\`` },
            { name: ' Versions', value: `> DiscordJS : \`\`${version}\`\`\n> NodeJS : \`\`${process.version}\`\`\n> Mongoose: \`\`${mongoose}\`\`` }
        ) 
        
        await interaction.reply({ embeds: [embed] })       
    }
}
