const {getUsers, addUser, removeUser, getUserCount, entryRequest} = require('./socketUser');
const {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime} = require('./socketAuction');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log("connected to server");
        var roomName;

        //  HOMEPAGE

        socket.on('joined-homepage', (data) => {
            console.log("JOINED HOMEPAGE")
            roomName = data.roomName;

            socket.join(roomName);

            //Send online users count to home
            io.to('home').emit('online-users', getUserCount());

            //Emit auction to sender
            io.to(socket.id).emit('get-auction', getAuction());
        })

        socket.on('entry-request', (email, callback) => {
            callback(entryRequest(email));
        })

        socket.on('check-auction', (callback) => {
            // if there is no auction, allow entry
            if (getMaxBidders() == -1)
                callback(true)

            else
                callback(false)
        })


        //  HOST CHATROOM

        socket.on('start-auction', () => {
            startAuction()

            io.emit('get-auction', getAuction())
            updateTimer()
        })

        function updateTimer() {
            var time = getBidTime() * 60000     // minutes to seconds
            var interval = 60000

            if (time == 60000) {
                interval = 1000                 // change to seconds update
            }

            setInterval(function() {
                io.emit('update-timer', time)

                time -= interval

                if (time == 60000) {
                    interval = 1000             // change to seconds update
                }

                if (time == 0) {
                    io.emit('')
                    clearInterval()
                }
            }, interval)
        }

        //  CHATROOM

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email;            
            addUser(user);

            roomName = data.roomName;
            
            //Joining the Socket Room
            socket.join(roomName);

            //Emit auction to sender
            io.to(socket.id).emit('get-auction', getAuction());

            //Emitting New name to Clients
            io.to(roomName).emit('joined-user', {name: data.name});
    
            //Send online users count to both home and auction chatroom
            io.emit('online-users', getUserCount());
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
                console.log(socket.id);
                removeUser(socket.id);
        
                //Send online users count to both home and auction chatroom
                io.emit('online-users', getUserCount())
            }
        })

        //pass item details to homepage
        socket.on('createchat', (data) => {
            data.start = false
            newAuction(data);

            // emit to clients waiting for auction to open
            io.to('home').emit('get-auction', getAuction())
        })
    })
}

module.exports = socket;