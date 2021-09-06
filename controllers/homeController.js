const getPermittedUsers =  require('./../utils/socketUser').getPermittedUsers;
const getAuction = require('./../utils/socketAuction').getAuction;

const homeController = {
	home: function(req,res) {
		res.render('homepage')
	},

	getChatroom: function(req,res) {
		console.log(getAuction())
        res.render('chatroom', getAuction());
    },

    newRoom: function(req, res) {
    	res.render('createRoom');
    },

    getChatroomHost: function(req,res) {
		console.log(getAuction())
        res.render('chatroom_host', getAuction());
    }
}

module.exports = homeController