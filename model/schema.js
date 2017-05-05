var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var exports = module.exports = {};

exports.userSchema = new Schema({
    userName: String,
});

exports.chatMessageSchema = new Schema({
    user: exports.userSchema,
    message: String,
    sendTime: Date,
});

exports.chatRoomSchema = new Schema({
    name: String,
    chatMessages: [exports.chatMessageSchema],
});

exports.User = mongoose.model('User', exports.userSchema);
exports.ChatMessage = mongoose.model('ChatMessage', exports.chatMessageSchema);
exports.ChatRoom = mongoose.model('ChatRoom', exports.chatRoomSchema);