const {getUsers, addUser, removeUser, getUserCount} = require('./socketUser');

//Socket connection
function socket(io) {
    io.on('connection', (socket, roomName) => {
        socket.on('joined-user', (data) =>{
            console.log("new user: " + data.email)
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email;            
            addUser(user);
            
            //Joining the Socket Room
            socket.join(roomName);
    
            //Emitting New name to Clients
            io.to(roomName).emit('joined-user', {name: data.name});
    
            //Send online users count
            io.to(roomName).emit('online-users', getUserCount());

            socket.emit
        })
    
        //Emitting messages to Clients
        socket.on('chat', (data) =>{
            io.to(roomName).emit('chat', {name: data.name, message: data.message});
        })
    
        //Broadcasting the user who is typing
        socket.on('typing', (data) => {
            socket.broadcast.to(roomName).emit('typing', data.name)
        })
    
        //Remove user from memory when they disconnect
        socket.on('disconnecting', ()=>{
            var rooms = Array.from(socket.rooms);
            var socketId = rooms[0];

            console.log("DISCONNECTING: " + socketId)
            // var roomname = rooms[1];
            removeUser(socketId);
    
            //Send online users count
            io.to(roomName).emit('online-users', getUserCount())
        })
    })
}

module.exports = socket;