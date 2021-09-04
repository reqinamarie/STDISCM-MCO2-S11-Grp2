//Store connected Users
var users = []

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
	users.forEach((user, index) => {
        if(user[socketId]){
            users.splice(index, 1)
        }
    });
}

function getUserCount() {
	return users.length
}

module.exports = {getUsers, addUser, removeUser, getUserCount};