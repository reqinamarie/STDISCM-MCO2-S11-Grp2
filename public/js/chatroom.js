const output = $('#output');
const feedback = $('#feedback');
const userCount = $('#currPeople');
// const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket)

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const fName = urlParams.get('fName');
const lName = urlParams.get('lName');
const email = urlParams.get('email');
console.log(fName, lName, email);

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    name: fName + " " + lName,
    email: email,
    roomName: 'auction-room'
})

//Sending data when user clicks send
// send.on('click', () =>{
//     console.log(message.value);

//     socket.emit('chat', {
//     name: fName + " " + lName,
//         message: message.value,
//     })
//     message.value = '';
// })

function sendMessage() {
    socket.emit('chat', {
    name: fName + " " + lName,
        message: $('#message').val(),
    })
    $('#message').val('');    
}

//Sending username if the user is typing
$('#message').on('keypress', () => {
    socket.emit('typing', {name: fName + " " + lName,})
})

//Displaying if new user has joined the room
socket.on('joined-user', (data)=>{
    $('#output').append('<p> -> <em><strong>' + data.name + ' </strong>has joined the room.</em></p>');
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    console.log(data)
    $('#output').append('<div class="card my-3 card-margin"><p class="per-message p-2"><strong>' + data.name + '</strong>: ' + data.message + '</p></div>');
    $('#feedback').val('');
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying if a user is typing
socket.on('typing', (user) => {
    $('#feedback').val('<p><em>' + user + ' is typing...</em></p>');
})

//Displaying online users
socket.on('online-users', (data) =>{
    console.log(data)
    $('#currPeople').text(data)
})

//Displaying item details on chatroom
socket.on('get-auction', (data) => {
    if (data.start) {
        $("#timer").css('color', '#DC143C')
        updateTime(data.bidTime * 60000, "timer", " left")
        return;
    }

    console.log(data.item);
    $('#itemName').text(data.item);
    $('#itemDescription').text(data.desc);
    $('#startingPrice').text(data.startPrice);
    $('#autobuyPrice').text(data.buyPrice);
    $('#maxPeople').text(data.maxBidders);
    $('#bidTime').text(data.bidTime);

})


socket.on('end-auction', (data) => {
    $("#winner").text(data)
    $(".modal").modal("show")

    var time = 10000

    setInterval(function() {
        updateTime(time, "end-timer", "")

        time -= 1000

        if (time < 0) {
            document.location.href="/";
        }
    }, 1000)
})


function updateTime(milliseconds, id, text) {
    if (milliseconds > 60000) {
        $("#" + id).text((milliseconds / 60000) + " minutes")
    } else {
        $("#" + id).text((milliseconds / 1000) + " seconds")
    }
}

//Update timer
socket.on('update-timer', (data) => {
    updateTime(data, "timer", " left")
})
