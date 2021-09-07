const io = require("socket.io-client");
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

const homeController = {

	home: function(req,res) {
		res.render('homepage')
	},

	postLogin: function(req, res, next) {
		if (req.body.email == null) {
			res.redirect('/')
		}

		// IF USER IS HOST
		else if (req.body.host) {
			console.log('host ', req.body.email)
			socket.emit('controller-host-request', (host) => {
	    		console.log("HOSTTT")

				if (req.body.email != host.email) {
	    			res.redirect('/')
				} else {    			
					socket.emit('controller-auction-request', (auction) => {
						console.log("REDIRECTING")
						auction.fName = req.body.fName 
						auction.lName = req.body.lName
						auction.email = req.body.email
						auction.host = true

						res.render('chatroom_host', auction)

					})
				}

	    	})
		}

		// IF USER IS BIDDER
		else {
			console.log('bidder ', req.body.email)
			socket.emit('controller-user-request', (allowedUsers) => {
				console.log(allowedUsers)

				if (allowedUsers.includes(req.body.email)) {
					socket.emit('controller-auction-request', (auction) => {
						console.log("REDIRECTINGGG")
						auction.fName = req.body.fName 
						auction.lName = req.body.lName
						auction.email = req.body.email

						res.render('chatroom', auction)
					})
				} else {
					res.redirect('/')
				}
			})
		}
		
	},

    newRoom: function(req, res) {
    	res.render('createRoom', req.body);
    },

    getChatroomHost: function(req,res) {
		if (req.body.email == null) {
			res.redirect('/')
			return;
		}

    	
    },

    redirectHome: function(req, res) {
    	res.redirect('/')
    }
}

module.exports = homeController