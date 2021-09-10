var auction = {}
var bids = []

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

function hasStarted() {
	return auction.start
}

function setBid(bid, user) {
	userbid = {
		bid: parseInt(bid),
		user: user
	}

	if (auction.start == null)
		return null;

	if (bid >= parseInt(auction.buyPrice)) {
		console.log('autobuy')
		currBid.push(userbid)
		
		auction.start = null
		return null;
	}
	
	if (bid > currBid.at(-1).bid) {
		console.log(bid, user, "success")
		currBid.push(userbid)

		return true
	} else {
		console.log(bid, user, "fail")
		return false
	}
}

function getBid() {
	return currBid.at(-1)
}

function rollbackBid(users) {
	var changed = false

	while (currBid.length > 0 && users.length == 0 && !users.includes(currBid.at(-1).user.email)) {
		currBid.pop()
		changed = true
	}

	if (currBid.length == 0)
		return null
	else
		return changed
}

module.exports = {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime, setBid, getBid, hasStarted, rollbackBid}