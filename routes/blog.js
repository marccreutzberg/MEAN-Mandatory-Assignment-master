var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schema = require('../model/schema');
var database = require('../model/database');

/* Check if username exists */
router.get('/getLoginCheck', function (req, res, next) {
    var userName = req.query.userName;

    schema.User.findOne({'userName': userName}).exec(function (err, user) {
        if (err)
            return console.error(err);
        res.send(user);
    });

});

/* Add user*/
router.post('/addUser', function (req, res, next) {
    var userName = req.query.userName;

    schema.User.findOne({'userName': userName}).exec(function (err, user) {
        if (err)
            return console.error(err);
        if (user != null) {
            res.send(null);
        }
        else {
            var newUser = new schema.User();
            newUser.userName = userName;
            newUser.save(function (err, createdUser) {
                result = err ? err : createdUser;
                res.send(result);
            });
        }

    });


});


/* GET all chat rooms */
router.get('/getChatRooms', function (req, res, next) {
    schema.ChatRoom.find({}).exec(function (err, rooms) {
        if (err)
            return console.error(err);
        res.send(rooms);
    });

});

/* GET all chat messages from room */
router.get('/getChatMessages', function (req, res, next) {
    var chatRoom = req.query.chatRoom;

    schema.ChatRoom.findOne({'name': chatRoom}).exec(function (err, room) {
        if (err)
            return console.error(err);
        res.send(room.chatMessages);
    });
});


/*POST add chat room*/
router.post('/addChatRoom', function (req, res, next) {

    var instance = new schema.ChatRoom({
        name: req.body.chatRoom,
    });

    instance.save(function (err, Blog) {
        result = err?err:Blog;
        res.send(result);
        return result;
    });
});


/*Post chatMessage*/
router.post('/addChatMessage', function (req, res, next) {
    var instance = new schema.ChatMessage({
        message: req.body.chatMessage.message,
        sendTime: req.body.chatMessage.date,
        user: req.body.chatMessage.user,
    });

    schema.ChatRoom.findOne({'name': req.body.selectedRoom}).exec(function (err, room) {
        if (err)
            return console.error(err);

        room.chatMessages.push(instance);
        room.save();
    });


    instance.save(function (err, Blog) {
        result = err ? err : Blog;
        res.send(result);
        return result;
    });
});

//export the router
module.exports = router;
