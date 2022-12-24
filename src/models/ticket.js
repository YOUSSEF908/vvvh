const mongoose = require("mongoose");

const ticket = new mongoose.Schema({
    channelId: String,
    messageId: String,
    channelMessageId: String,
    userId: String,
    closed: Boolean
});

module.exports = mongoose.model("ticket", ticket);