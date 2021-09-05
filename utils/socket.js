const {getUsers, addUser, removeUser, getUserCount} = require('./socketUser');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log("connected to server");
        var roomName;

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email;            
            addUser(user);

            roomName = data.roomName;
            
            //Joining the Socket Room
            socket.join(roomName);
    
            //Emitting New name to Clients
            io.to(roomName).emit('joined-user', {name: data.name});
    
            //Send online users count to both home and auction chatroom
            io.emit('online-users', getUserCount());
        })

        socket.on('joined-homepage', (data) => {
            console.log("JOINED HOMEPAGE")
            roomName = data.roomName;

            socket.join(roomName);

            //Send online users count to home
            io.to('home').emit('online-users', getUserCount());
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
            if (roomName != 'home') {
                var rooms = Array.from(socket.rooms);
                var socketId = rooms[0];

                console.log(socketId);
                removeUser(socketId);
        
                //Send online users count to both home and auction chatroom
                io.emit('online-users', getUserCount())
            }
        })
    })
}

module.exports = socket;