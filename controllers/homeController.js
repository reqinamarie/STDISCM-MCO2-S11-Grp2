const io = require("socket.io-client");
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

const homeController = {

	home: function(req,res) {
		res.render('homepage')
	},

	postLogin: function(req, res) {
		console.log(req.body)

		socket.emit('controller-user-request', req.body.email)
		socket.on('controller-permission', (allowedUsers) => {
			console.log(allowedUsers)

			if (allowedUsers.includes(req.body.email)) {
				socket.emit('controller-auction-request')
				socket.on('controller-auction', (auction) => {
					auction.fName = req.body.fName 
					auction.lName = req.body.lName
					auction.email = req.body.email

					res.render('chatroom', auction)
				})
			} else {
				res.redirect('/')
			}
		})
		
	},

    newRoom: function(req, res) {
    	res.render('createRoom', req.body);
    },

    getChatroomHost: function(req,res) {
		socket.emit('controller-auction-request')
		socket.on('controller-auction', (auction) => {
			res.render('chatroom', auction)
		})
    },

    redirectHome: function(req, res) {
    	res.redirect('/')
    }
}

module.exports = homeController