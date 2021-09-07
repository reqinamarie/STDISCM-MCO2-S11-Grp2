//const output = $('#output');
//const feedback = $('#feedback');
////const userCount = $('#currPeople');
// const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket);

var x = 0;
var uploaded = null;
//=================================
var loadFile = function(event) {
    console.log("test");

    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
    console.log("target.files: ", event.target.files[0]);
    console.log("image.src: ", image.src);
    x=2;
    uploaded = image.src;
};

function createRoom() {

    console.log(x);
    console.log(uploaded);
    console.log('button clicked');
    item = $('#itemName').val();
    photo = uploaded;
    desc = $('#itemDesc').val();
    startPrice = $("#startPrice").val();
    buyPrice = $('#buyPrice').val();
    maxBidders = $('#maxBidders').val();
    bidTime = $('#bidTime').val();

    console.log("photo: ", photo);
    console.log(item);
    socket.emit('createchat', {
        item: item,
        photo: photo,
        desc: desc,
        startPrice: startPrice,
        buyPrice:buyPrice,
        maxBidders: maxBidders,
        bidTime:bidTime,
        roomName: 'auction-room'
    })
}


