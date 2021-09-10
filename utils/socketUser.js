const getMaxBidders = require('./socketAuction').getMaxBidders;

//Store connected Users
var users = []
var permittedUsers = []
var host = {}

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
    var email = null

	users.forEach((user, index) => {
        if(user[socketId]){
            console.log('disconnected')
            console.log(users)
            users.splice(index, 1)

            var i = permittedUsers.indexOf(user[socketId]);
            if (i > -1) {
                email = permittedUsers[i]
                permittedUsers.splice(i, 1)
            }
        }
    });

    console.log("AFTER EXIT: ", permittedUsers.length)
    return email
}

function getUserCount() {
	console.log(users.length)
	return users.length
}

function entryRequest(email) {
    console.log("BEFORE ENTRY: ", permittedUsers.length, " ", email)

    if (permittedUsers.length < getMaxBidders() + 1) {
        // user already exists
        if (permittedUsers.indexOf(email) > -1) {
            return null;
        }

        // new user
        permittedUsers.push(email)
        console.log("AFTER ENTRY: ", permittedUsers.length)
        return true
    }

    return false
}

function getPermittedUsers() {
    return permittedUsers
}

function clearPermittedUsers() {
    permittedUsers = []
}

function setHost(data) {
    host = data
}

function getHost() {
    return host
}

function clearHost() {
    host = {}
}

module.exports = {getUsers, addUser, removeUser, getUserCount, entryRequest, getPermittedUsers, clearPermittedUsers, setHost, getHost, clearHost};