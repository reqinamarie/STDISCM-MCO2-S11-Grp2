
//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket);

var x = 0;
var received;

var createRoomMsg = " Creating auction room... ",
    createErrorMsg = " Something went wrong. Please try again. ",
    createFailMsg = " Sorry! An auction is already ongoing. Please wait until the current session ends before trying again. ";

$(document).ready(function() {
    $("#file").on('change', function(e) {
        received = false;

          var data = e.originalEvent.target.files[0];
          var reader = new FileReader();

          reader.onload = function (evt) {

                var msg = {};
                msg.file = evt.target.result;
                msg.fileName = data.name;
                socket.emit("image-upload", msg);
          };

          reader.readAsDataURL(data);
    })
})

function changeToast(message) {
    $("#toast").toast('dispose')

    var t = setTimeout(function (){
        $(".toast-body").text(message)
        $("#toast").toast('show')

        clearInterval(t)
    }, 200);

    console.log(message)
}

function createRoom() {
    if (!received) {
        console.log('not yet received')
        changeToast(createErrorMsg)
        return;
    }

    changeToast(createRoomMsg)

    item = $('#itemName').val();
    desc = $('#itemDesc').val();
    startPrice = $("#startPrice").val();
    buyPrice = $('#buyPrice').val();
    maxBidders = $('#maxBidders').val();
    bidTime = $('#bidTime').val();

    socket.emit('createchat', {
        item: item,
        desc: desc,
        startPrice: startPrice,
        buyPrice:buyPrice,
        maxBidders: maxBidders,
        bidTime:bidTime,
        roomName: 'auction-room'
    }, {fName: fName, 
        lName: lName, 
        email: email
    })

}

socket.on('image-received', () => {
    received = true;
})

socket.on('create-auction', (success) => {
    if (success) {
        $.post('/chatroom', {fName: fName, lName: lName, email: email, host: true})
    } else {
        changeToast(createFailMsg)
    }
})


