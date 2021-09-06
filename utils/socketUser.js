const {getMaxBidders} = require('./socketAuction').getMaxBidders;

//Store connected Users
var users = []
var userCount = 0

// get online users
function getUsers(){
    // onlineUsers = []

    // users.forEach((onlineUser) => {
    //     onlineUsers.push(Object.values(onlineUser)[0])
    // })

    return users
}

// push to users object
function addUser(user) {
	users.push(user)
}

// remove user from object
function removeUser(socketId) {
	console.log("DISCONNECTING: " + socketId)

	users.forEach((user, index) => {
        if(user[socketId]){
            console.log('disconnected')
            console.log(users)
            users.splice(index, 1)
        }
    });

    userCount -= 1
}

function getUserCount() {
	console.log(users.length)
	return users.length
}

function entryRequest() {
    console.log("BEFORE ENTRY: ", userCount)

    if (userCount < getMaxBidders()) {
        userCount += 1
        return true
    }

    return false
}

module.exports = {getUsers, addUser, removeUser, getUserCount, entryRequest};