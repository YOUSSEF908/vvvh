const mongoose = require("mongoose");

const ticketSetup = new mongoose.Schema({
    categoryId: String,
    guildId: String,
    channelId: String,
    messageId: String,
    authorRoleId: String,
    embedColor: String
});

module.exports = mongoose.model("ticketSetup", ticketSetup);