
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

    //invalid values
    if (document.getElementById("itemName").value.length == 0) {
        $('#itemName').css('border-color', 'red');    
        countE = true;
    }
    if (document.getElementById("itemDesc").value.length == 0) {
        $('#itemDesc').css('border-color', 'red'); 
        countE = true;
    }
    if (document.getElementById("startPrice").value.length == 0 || 
        document.getElementById("startPrice").value < 0) {
        $('#startPrice').css('border-color', 'red');    
        countE = true;
    }
    if (document.getElementById("buyPrice").value.length == 0 ||
        document.getElementById("startPrice").value >=  document.getElementById("buyPrice").value) {
        $('#buyPrice').css('border-color', 'red'); 
        countE = true;
    }
    if (document.getElementById("maxBidders").value.length == 0 ||
        document.getElementById("maxBidders").value < 2) {
        $('#maxBidders').css('border-color', 'red'); 
        countE = true;
    }
    if (document.getElementById("bidTime").value.length == 0 ||
        document.getElementById("bidTime").value < 2) {
        $('#bidTime').css('border-color', 'red'); 
        countE = true;
    }

    //if has invalid values
    if(countE) {
        console.log('countE is true');
        $('#errorMsg').text('The highlighted boxes require valid inputs.');
    }

    //if valid values but no photo
    if (!received && !countE) {
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
})

socket.on('create-auction', (success) => {
    console.log('CREATE ', success)

    if (success) {
        $("#createRoomForm").submit()
    } else {
        changeToast(createFailMsg)
    }
})


