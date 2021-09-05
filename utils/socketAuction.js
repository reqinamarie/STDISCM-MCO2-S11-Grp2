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

module.exports = {newAuction, deleteAuction, getAuction}