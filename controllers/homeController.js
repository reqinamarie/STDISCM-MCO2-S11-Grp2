const io = require("socket.io-client");
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

const homeController = {

	home: function(req,res) {
		res.render('homepage')
	},

	postLogin: function(req, res, next) {
		console.log(req.body)

		socket.emit('controller-user-request', req.body.email)
		socket.on('controller-permission', (permit) => {
			if (permit) {
				socket.emit('controller-auction-request')
				socket.on('controller-auction', (auction) => {
					console.log(auction)
					res.render('chatroom', auction)
				})
			} else {
				res.redirect('/')
			}
		})
		

		// socket.on()
	},

	getChatroom: function(req,res) {
		console.log("GET")

		console.log(req.body)

    },

    newRoom: function(req, res) {
    	res.render('createRoom');
    },

    getChatroomHost: function(req,res) {
		socket.emit('controller-auction-request')
		socket.on('controller-auction', (auction) => {
			console.log(auction)
			res.render('chatroom', auction)
		})
    }
}

module.exports = homeController