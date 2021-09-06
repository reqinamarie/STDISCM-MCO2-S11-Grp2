const io = require("socket.io-client");
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

const homeController = {

	home: function(req,res) {
		res.render('homepage')
	},

	getChatroom: function(req,res) {
		socket.emit('controller-auction-request')
		socket.on('controller-auction', (auction) => {
			console.log(auction)
			res.render('chatroom', auction)
	})
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