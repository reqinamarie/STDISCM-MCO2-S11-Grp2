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

module.exports = {newAuction, deleteAuction, getAuction}