var auction = {}

function newAuction(data) {
	auction = data;
}

function deleteAuction() {
	auction = {};
}

function getAuction() {
	return auction
}

function startAuction() {
	auction.start = true
}

function getMaxBidders() {
	if (Object.keys(auction).length) {
		return auction.maxBidders;
	}

	return -1;
}

module.exports = {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders}