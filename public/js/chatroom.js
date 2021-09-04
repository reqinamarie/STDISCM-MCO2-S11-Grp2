const output = $('#output');
const feedback = $('#feedback');
const userCount = $('#currPeople');
// const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('https://a-chatting-app.herokuapp.com/');
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
    email: email
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
    $('#output').append('<p>--> <strong><em>' + data.name + ' </strong>has Joined the Room</em></p>');
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    $('#output').append('<p><strong>' + data.name + '</strong>: ' + data.message + '</p>');
    $('#feedback').val('');
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying if a user is typing
socket.on('typing', (user) => {
    $('#feedback').val('<p><em>' + user + ' is typing...</em></p>');
})

//Displaying online users
socket.on('online-users', (data) =>{
    $('#currPeople').val(data)
})