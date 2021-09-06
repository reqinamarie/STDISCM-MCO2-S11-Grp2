const getPermittedUsers =  require('./../utils/socketUser').getPermittedUsers;
const getAuction = require('./../utils/socketAuction').getAuction;
const socket = require('./../utils/socket');

const homeController = {
	home: function(req,res) {
		res.render('homepage')
	},

	getChatroom: function(req,res) {
		console.log(socket.getAuction())
        res.render('chatroom', socket.getAuction());
    },

    newRoom: function(req, res) {
    	res.render('createRoom');
    },

    getChatroomHost: function(req,res) {
		console.log(socket.getAuction())
        res.render('chatroom_host', socket.getAuction());
    }
}

module.exports = homeController