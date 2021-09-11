
//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

var joinRoomMsg = " Joining auction room... ",
	fullRoomMsg = " Sorry! The auction room is full. Please wait for the next auction to start. ",
	createFailMsg = " Sorry! There is already an existing auction. Please wait until the current session ends. ",
	joinSuccessMsg = " Entering the auction room. You will be redirected shortly. ",
	userExistsMsg = "Email already in use.";

var max_people = 99999999999;

socket.emit('joined-homepage', {roomName: 'home'});

socket.on('get-auction', (data) => {
	if (data.start == null) 
		endAuction()
	else if (data.start == false)
		loadAuction(data)
	else
		ongoingAuction(data)
})

socket.on('clear-auction', () => {
	endAuction()    
})

function loadAuction(data) {
	console.log("load")

	$("#joinBtn").prop('disabled', false);
	$("#createRoomBtn").prop('disabled', true);
	$("#loginForm").prop("action", "/chatroom");

    $('#itemName').text(data.item);
    $('#itemDescription').text(data.desc);


    var imgItem = document.getElementById('itemImage');
	imgItem.src = data.photo;
    $('#startingPrice').text(data.startPrice);
    $('#autobuyPrice').text(data.buyPrice);
    $('#maxPeople').text(data.maxBidders);
    $('#bidTime').text(data.bidTime);

	max_people = data.maxPeople;

	$(".without-auction").hide();
	$(".with-auction").show();

}

function endAuction() {
	$("#joinBtn").prop('disabled', true);
	$("#createRoomBtn").prop('disabled', false);
	$("#loginForm").prop("action", "/createRoom");
	
	$(".auction-message").text('No auctions ongoing')
	$(".with-auction").hide();
	$(".without-auction").show();

	$("#itemName").text('')
	$("#itemDescription").text('')
	$("#startPrice").text('')
	$("#autobuyPrice").text('')
	$("#bidTime").text('')
	$("#maxPeople").text('')
}

function ongoingAuction(data) {
	$("#joinBtn").prop('disabled', true);
	$("#createRoomBtn").prop('disabled', true);

	$(".auction-message").text('Auction currently ongoing. Please wait for the next auction.')
	$(".with-auction").hide();
	$(".without-auction").show();
}

//Displaying online users
socket.on('online-users', (data) =>{
    console.log(data)
	if (data >= max_people) {
		$("#joinBtn").prop('disabled', true);
	}

    $('#currPeople').text(data)
})


function submitForm(action) {
	$("#loginForm").prop('action', action)
	$("#loginForm").submit()
}

function changeToast(id, message) {
	var toastId = "#toast-" + id,
		toastBodyId = "#toast-msg-" + id

	console.log($(toastId))
    $(toastId).toast('dispose')

    var t = setTimeout(function (){
        $(toastBodyId).text(message)
        $(toastId).toast('show')

        clearInterval(t)
    }, 100);

    console.log(message)
}

$(document).ready(function() {

	$("input").on('focusout', function() {
		if (this.checkValidity())
			$(this).css('border-color', 'darkgrey')
		else
			$(this).css('border-color', 'red')
	})

	$("#joinBtn").on('click', function() {
		if (!document.getElementById("loginForm").checkValidity()) {
			$("input").focusout()
			return;
		}

		// $("#joinAuctionRoomToast").toast('show');
		changeToast(1, joinRoomMsg)

		email = $("#email").val()

		socket.emit('entry-request', email, (response) => {
			console.log(response)

			if (response == null) {
				changeToast(2, userExistsMsg);
			} else if (response) {
				// $("#joinSuccessToast").toast('show')
				changeToast(2, joinSuccessMsg);
				submitForm('/chatroom')
			} else {
				changeToast(2, fullRoomMsg);
				// $("#joinFailToast").toast('show')
			}

		})
	})

	$("#createRoomBtn").on('click', function() {
		if (!document.getElementById("loginForm").checkValidity()) {
			$("input").focusout()
			return;
		}

		socket.emit('check-auction', (response) => {
			console.log(response)

			if (response) {
				submitForm('/createRoom')
			} else {
				// $("#createFailToast").toast("show")
				changeToast(1, createFailMsg)
			}

		})
	})
})
