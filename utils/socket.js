const {getUsers, addUser, removeUser} = require('./socketUser');

//Socket connection
function socket(io) {
    var roomName = 'auction-room'

    io.on('connection', (socket) => {

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email;            
            addUser(user);
            
            //Joining the Socket Room
            socket.join(roomName);
    
            //Emitting New name to Clients
            io.to(roomName).emit('joined-user', {name: data.name});
    
            //Send online users array
            io.to(roomName).emit('online-users', getUsers())
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
            var rooms = Object.keys(socket.rooms);
            var socketId = rooms[0];
            // var roomname = rooms[1];

            removeUser(socketId);
    
            //Send online users array
            io.to(roomname).emit('online-users', getUsers())
        })
    })
}

module.exports = socket;