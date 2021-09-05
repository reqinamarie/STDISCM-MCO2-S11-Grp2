//const output = $('#output');
//const feedback = $('#feedback');
////const userCount = $('#currPeople');
// const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket)

function createRoom() {
    item = $('#itemName').val();
    photo = $('#inputGroupFile02').input();
    desc = $('#itemDesc').val();
    startPrice = $("#startPrice").val();
    buyPrice = $('#buyPrice').val();
    maxBidders = $('#maxBidders').val();
    bidTime = $('#bidTime').val();

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

    $('#itemName').val('');
    $('#inputGroupFile02').input('');
    $('#itemDesc').val('');
    $("#startPrice").val('');
    $('#buyPrice').val('');
    $('#maxBidders').val('');
    $('#bidTime').val('');
}


