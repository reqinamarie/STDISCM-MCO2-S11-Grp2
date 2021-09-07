var auction = {}
var currBid = {}

function newAuction(data) {
	auction = data;
	currBid = {
		bid: auction.startPrice-1
	}
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
	if (Object.keys(auction).length != 0) {
		return auction.maxBidders;
	}

	return -1;
}

function getBidTime() {
	return auction.bidTime
}

function setBid(bid, user) {
	bid = parseInt(bid)

	if (auction.start == null)
		return null;

	if (bid >= parseInt(auction.buyPrice)) {
		auction.start = null
		return 'autobuy';
		console.log("autobuy", bid, auction.buyPrice, bid >= auction.buyPrice)
	}
	
	if (bid > currBid.bid) {
		console.log(bid, user, "success")
		currBid.bid = bid
		currBid.user = user
		return true
	} else {
		console.log(bid, user, "fail")
		return false
	}
}

function getBid() {
	return currBid
}

module.exports = {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime, setBid, getBid}