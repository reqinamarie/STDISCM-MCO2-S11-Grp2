const homeController = {
	home: function(req,res) {
		var dummyData = {
			itemName: "ITEM",
			itemDesc: "item's long-ish description",
			startPrice: 100.00,
			autobuyPrice: 1000.00,
			bidTime: 15,
			maxPeople: 10
		}

		res.render('homepage', dummyData)
	}
}

module.exports = homeController