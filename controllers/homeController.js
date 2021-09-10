const io = require("socket.io-client");
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

const homeController = {

	home: function(req,res) {
		res.render('homepage')
	},
	loaderio: function(req,res) {
		res.render('loaderio-074fbd34ebed28cf3cf10a9f13374a16')
	},

	postLogin: function(req, res, next) {
		if (req.body.host == null) {
			res.redirect('/')
		}

		else {
			socket.emit('controller-auction-request', (auction) => {

				// if auction has already started or there is no auction yet, block anyone from (re-)joining
				if (auction.start == true || auction.start == null)
					res.redirect('/')

				else {
					//	if client is the host
					if (req.body.host == "true") {
						socket.emit('controller-host-request', (host) => {

							//	if the emails don't match, redirect to homepage
							if (req.body.email.toLowerCase() != host.email.toLowerCase())
								res.redirect('/')

							else {
								auction.fName = req.body.fName 
								auction.lName = req.body.lName
								auction.email = req.body.email
								auction.host = true

								res.render('chatroom_host', auction)
							}
						})
					}

					//	if client is a bidder
					else {
						socket.emit('controller-user-request', (allowedUsers) => {

							//	if client is part of allowed users, redirect to chatroom
							if (allowedUsers.includes(req.body.email.toLowerCase())) {
								auction.fName = req.body.fName 
								auction.lName = req.body.lName
								auction.email = req.body.email
								auction.host = false

								res.render('chatroom', auction)
							}

							//	else, redirect to home
							else 
								res.redirect('/')
						})
					}

				}

			})
		}
	},

    newRoom: function(req, res) {
    	res.render('createRoom', req.body);
    },

    redirectHome: function(req, res) {
    	res.redirect('/')
    }
}

module.exports = homeController