const {getUsers, addUser, removeUser, getUserCount, entryRequest, getPermittedUsers, clearPermittedUsers, setHost, getHost, clearHost} = require('./socketUser');

const {newAuction, deleteAuction, getAuction, startAuction, getMaxBidders, getBidTime, setBid, getBid} = require('./socketAuction');

//Socket connection
function socket(io) {
    io.on('connection', (socket) => {
        console.log("connected to server");
        var roomName;
        var image = {};
        var timer;

        //  HOMEPAGE

        socket.on('joined-homepage', (data) => {
            console.log("JOINED HOMEPAGE")
            roomName = 'home';

            socket.join(roomName);

            //Send online users count to home
            io.to('home').emit('online-users', getUserCount());

            //Emit auction to sender
            io.to(socket.id).emit('get-auction', getAuction());
        })

        socket.on('entry-request', (email, callback) => {
            callback(entryRequest(email.toLowerCase()));
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
            var auction = getAuction();

            io.emit('get-auction', auction)
            io.to('auction-room').emit('start-auction', auction.bidTime)
            updateTimer()
        })

        function updateTimer() {
            var time = getBidTime() * 60000     // minutes to seconds
            var minute = 60000
            var interval = 1000

            timer = setInterval(function() {
                time -= interval

                if (time >= minute && time % minute == 0) {
                    console.log('minute passed')
                    io.emit('update-timer', time)
                } else if (time < minute) {
                    io.emit('update-timer', time)
                }

                if (time <= 0) {
                    io.emit('end-auction', getBid())
                    clearInterval(timer)

                    restartAuction(10000)
                }
            }, 1000)
        }

        //  CHATROOM

        socket.on('joined-user', (data) =>{
            //Storing users connected in a room in memory
            var user = {};
            user[socket.id] = data.email.toLowerCase();      

            if (!data.host) 
                addUser(user);                
            if (data.host) {
                var host = getHost()
                host.socketId = socket.id

                setHost(host)
                entryRequest(host.email)
            }

            roomName = 'auction-room';
            
            //Joining the Socket Room
            socket.join(roomName);

            if (getMaxBidders() == -1) {

                io.to(socket.id).emit('end-auction', null)
            }

            //Emit auction to sender
            // io.to(socket.id).emit('get-auction', getAuction());

            //Emitting New name to Clients
            // io.to(roomName).emit('joined-user', {name: data.name});
    
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

                // if the host is disconnected, end the auction
                if (getHost().socketId == socket.id) {
                    deleteAuction()
                    clearHost()
                    console.log(getHost().socketId, socket.id, "disconnected")
                    clearInterval(timer)
                    io.emit('end-auction', null)
                    restartAuction(10000)
                }

                console.log(socket.id);
                removeUser(socket.id);
        
                //Send online users count to both home and auction chatroom
                io.emit('online-users', getUserCount())
            }
        })

        //  CREATE ROOM PAGE

        //pass item details 
        socket.on('createchat', (auction, host) => {

            // if there is already an auction, reject create chatroom
            if (Object.keys(getAuction()).length != 0) {
                io.to(socket.id).emit('create-auction', false)
                return;
            }

            console.log("CREATING ROOM")

            // otherwise, proceed
            clearPermittedUsers()
            auction.start = false

            if (image.file != null) {
                auction.photo = image.file
            }

            newAuction(auction);
            // emit to clients waiting for auction to open
            io.emit('get-auction', getAuction())

            host.email = host.email.toLowerCase()
            setHost(host)

            io.to(socket.id).emit('create-auction', true)
        })

        socket.on('image-upload', (data) => {
            image = data
            io.to(socket.id).emit('image-received')
        })

        //  CONTROLLER

        socket.on('controller-auction-request', (callback) => {
            console.log("CONTROLLER RQ")
            callback(getAuction())

            // io.emit('controller-auction', getAuction())
        })

        socket.on('controller-user-request', (callback) => {
            callback(getPermittedUsers())
            // io.emit('controller-permission', getPermittedUsers())
        })

        socket.on('controller-host-request', (callback) => {
            callback(getHost())
            // io.emit('controller-host', getHost())
        })

        //  BIDDING

        socket.on('bid', (bid, user, callback) => {
            var res = setBid(bid, user)

            if (res == null) {
                io.to('auction-room').emit('autobuy', bid, user)
                clearInterval(timer)
                io.emit('end-auction', getBid())
                restartAuction(10000)
            } else if (res) {
                io.to('auction-room').emit('new-bid', bid, user)
            }

            callback(res)
        })

        socket.on('autobuy', (user) => {
            bid = getAuction().buyPrice;

            if (setBid(bid, user)) {
                io.to('auction-room').emit('autobuy', bid, user)
                clearInterval(timer)
                io.emit('end-auction', getBid())
                restartAuction(10000)
            }
        })

        // delay before letting others create a new auction again
        function restartAuction(delay) {
            console.log("RESTARTING")
            timer = setInterval(function() {
                deleteAuction()
                clearInterval(timer)
            }, delay)
        }
    })
}

module.exports = socket;