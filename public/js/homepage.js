
//Socket server URL
const socket = io.connect('https://discm-auction-chatroom.herokuapp.com/');

var max_people = 999999999999999999999999;

socket.emit('joined-homepage', {roomName: 'home'});

socket.on('get-auction', (data) => {
	if (data.start == null) 
		endAuction()
	else if (data.start == false)
		loadAuction(data)
	else
		ongoingAuction(data)
})


function loadAuction(data) {
	console.log("load")

	$("#joinBtn").prop('disabled', false);
	$("#createRoomBtn").prop('disabled', true);
	$("#loginForm").prop("action", "/chatroom");

    $('#itemName').text(data.item);
    $('#itemDescription').text(data.desc);
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

$(document).ready(function() {

	$("input").on('focusout', function() {
		if (this.checkValidity())
			$(this).css('border-color', 'darkgrey')
		else
			$(this).css('border-color', 'red')
	})

	$("#joinBtn").on('click', function() {
		if (!document.getElementById("loginForm").checkValidity()) {
			return;
		}

		$("#joinAuctionRoomToast").toast('show');

		email = $("#email").val()

		socket.emit('entry-request', email, (response) => {
			console.log(response)

			if (response) {
				$("#joinSuccessToast").toast('show')
				submitForm('/chatroom')
			} else {
				$("#joinFailToast").toast('show')
			}

		})
	})

	$("#createRoomBtn").on('click', function() {
		if (!document.getElementById("loginForm").checkValidity()) {
			return;
		}

		socket.emit('check-auction', (response) => {
			if (response) {
				submitForm('/createRoom')
			} else {
				$("#createFailToast").toast("show")
			}

		})
	})
})