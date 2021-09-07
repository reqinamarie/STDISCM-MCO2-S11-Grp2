//const output = $('#output');
//const feedback = $('#feedback');
////const userCount = $('#currPeople');
// const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket);

var x = 0;
var photo = {};
var received;

//=================================
// var loadFile = function(event) {
//     console.log("test");

//     var image = document.getElementById('output');
//     image.src = URL.createObjectURL(event.target.files[0]);
//     console.log("target.files: ", event.target.files[0]);
//     console.log("image.src: ", image.src);
//     x=2;
//     uploaded = image.src;
// };

$(document).ready(function() {
    $("#file").on('change', function(e, callback) {
        received = false;
        console.log("CHANGED")
          var data = e.originalEvent.target.files[0];
          var reader = new FileReader();

          console.log(e)
          console.log(callback)

          reader.onload = function (evt) {
                console.log("READER LOAD")
                console.log(evt)
                var msg = {};
                msg.file = evt.target.result;
                msg.fileName = data.name;
                socket.emit("image-upload", msg);
                console.log(msg)
          };

          reader.readAsDataURL(data);
    })
})

// function fileChange(elem, callback) {
//     console.log(elem)
// }

function createRoom() {
    $("#createToast").toast('show')

    if (!received) {
        console.log('not yet received')
        $("#createErrorToast").toast('show')
        return;
    }

    console.log('button clicked');

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
    })


    // fileChange($('#file'), function(photo) {
    //     console.log("photo: ", photo);
    //     console.log(item);
    //     socket.emit('createchat', {
    //         item: item,
    //         photo: photo,
    //         desc: desc,
    //         startPrice: startPrice,
    //         buyPrice:buyPrice,
    //         maxBidders: maxBidders,
    //         bidTime:bidTime,
    //         roomName: 'auction-room'
    //     })
    // })

    // fileChange($('#file'), function(){})
}

socket.on('image-received', () => {
    received = true;
})


