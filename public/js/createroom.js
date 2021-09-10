
//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');
console.log(socket);

var x = 0;
var received;
var src;

var createRoomMsg = " Creating auction room... ",
    createErrorMsg = " Something went wrong. Please try again. ",
    createInvalidErrorMsg = "Invalid input/s. Please try again. ",
    createFailMsg = " Sorry! An auction is already ongoing. Please wait until the current session ends before trying again. ";

$(document).ready(function() {
    $("#file").on('change', function(e) {
        received = false;
        $("#output").css('opacity', 0)

          var data = e.originalEvent.target.files[0];
          var reader = new FileReader();

          reader.onload = function (evt) {

                var msg = {};
                src = evt.target.result;
                msg.file = evt.target.result;
                msg.fileName = data.name;
                socket.emit("image-upload", msg);
          };

          reader.readAsDataURL(data);
    })

    $("input").on('focusout', function() {
        if (this.checkValidity())
            $(this).css('border-color', 'darkgrey')
        else
            $(this).css('border-color', 'red')
    })
    $("textarea").on('focusout', function() {
        if (this.checkValidity())
            $(this).css('border-color', 'darkgrey')
        else
            $(this).css('border-color', 'red')
    })

    $("#startPrice").on('change', function() {
        var new_min = Math.max(parseInt($("#startPrice").val()) + 1, 1)

        $("#buyPrice").prop('min', new_min)
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

    var countE = false;
    console.log("createroom() entered");

    if (!document.getElementById("createRoomForm").checkValidity()) {
        console.log("Other inputs")
        countE = true;
    }

    //if has invalid values
    if(countE) {
        console.log('countE is true');
        $('#errorMsg').text('The highlighted boxes require valid inputs.');
        return;
    }

    //if no photo
    if (!received) {
        console.log('not yet received')
        $('#errorMsg').text('Please upload an image.');
        return;
    }

    console.log("countE: ", countE);

    if (!countE) {
        console.log("valid data");
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

        $('#errorMsg').text('');
    }
}

socket.on('image-received', () => {
    received = true;
    console.log('received!')
    $("#output").prop('src', src)
    $("#output").css('opacity', 100)
})

socket.on('create-auction', (success) => {
    console.log('CREATE ', success)

    if (success) {
        $("#createRoomForm").submit()
    } else {
        changeToast(createFailMsg)
    }
})


