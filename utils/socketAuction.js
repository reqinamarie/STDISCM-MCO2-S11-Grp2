var auction = {}
var bids = []
var minBid = 0

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
		bids.push(userbid)
		
		auction.start = null
		return null;
	}
	
	if ((bid >= auction.startPrice && bids.length == 0) || bid > getBid().bid) {
		console.log(bid, user, "success")
		bids.push(userbid)

		return true
	} else {
		console.log(bid, user, "fail")
		return false
	}
}

function getBid() {
	return bids[bids.length-1]
}

function rollbackBid(users) {
	var changed = false

	while (bids.length > 0 && users.length > 0 && !users.includes(getBid().user.email)) {
		bids.pop()
		changed = true
	}

	if (bids.length == 0)
		return null
	else
		return changed
}

module.exports = {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime, setBid, getBid, hasStarted, rollbackBid}