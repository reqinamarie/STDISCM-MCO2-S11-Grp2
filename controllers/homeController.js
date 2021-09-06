
module.exports = function(io) {
	return {
		home: function(req,res) {
			res.render('homepage')
		},

		getChatroom: function(req,res) {
			io.emit('controller-auction-request')
			io.on('controller-auction', (auction) => {
				console.log(auction)
				res.render('chatroom', auction)
			})
	    },

	    newRoom: function(req, res) {
	    	res.render('createRoom');
	    },

	    getChatroomHost: function(req,res) {
			console.log(socket.getAuction())
	        res.render('chatroom_host', socket.getAuction());
	    }
	}	
}