const {getUsers, addUser, removeUser, getUserCount} = require('./socketUser');

//Socket connection
function socket(io) {
    var roomName = 'auction-room'

    io.on('connection', (socket) => {
        console.log("CONNECTED")

        socket.on('joined-user', (data) =>{
            console.log(data.email)
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email;            
            addUser(user);
            
            //Joining the Socket Room
            socket.join(roomName);
    
            //Emitting New name to Clients
            io.to(roomName).emit('joined-user', {name: data.name});
    
            //Send online users count
            io.to(roomName).emit('online-users', getUserCount())
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
            console.log(socket.rooms);
            console.log(Object.keys(socket.rooms));

            var rooms = Object.keys(socket.rooms);
            var socketId = rooms[0];

            console.log("DISCONNECTING: " + socketId)
            // var roomname = rooms[1];
            removeUser(socketId);
    
            //Send online users count
            io.to(roomName).emit('online-users', getUserCount())
        })

        socket.on('disconnect', () => {
            console.log(socket.rooms);
          });
    })
}

module.exports = socket;