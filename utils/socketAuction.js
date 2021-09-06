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
	if (Object.keys(auction).length == 0) {
		return auction.maxBidders;
	}

	return -1;
}

function getBidTime() {
	return auction.bidTime
}

module.exports = {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime}