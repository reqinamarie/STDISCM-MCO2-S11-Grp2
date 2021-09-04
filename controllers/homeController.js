const homeController = {
	home: function(req,res) {
		var dummyData = {
			itemName: "ITEM",
			itemDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et iaculis nibh. Donec sit amet tincidunt turpis, sit amet accumsan arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et iaculis nibh. Donec sit amet tincidunt turpis, sit amet accumsan arcu.",
			startPrice: 100.00,
			autobuyPrice: 1000.00,
			bidTime: 15,
			maxPeople: 10,
			withAuction: "none",
			withoutAuction: ""
		}

		res.render('homepage', dummyData)
	},

	getChatroom: function(req,res) {
		var item = {
			itemName: "ITEM",
			itemDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et iaculis nibh. Donec sit amet tincidunt turpis, sit amet accumsan arcu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et iaculis nibh. Donec sit amet tincidunt turpis, sit amet accumsan arcu.",
			startPrice: 100.00,
			autobuyPrice: 1000.00,
			bidTime: 15,
			maxPeople: 10
		}


        res.render('chatroom', item);
    },

    newRoom: function(req, res) {
    	res.render('createRoom');
    }

}

module.exports = homeController