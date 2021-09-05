
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

	$("#joinBtn").prop('disabled', false);
	$("#createRoomBtn").prop('disabled', true);
	$("#loginForm").prop("action", "/chatroom");

	$("#itemName").text(data.itemName)
	$("#itemDescription").text(data.itemDesc)
	$("#startPrice").text(data.startPrice)
	$("#autobuyPrice").text(data.autobuyPrice)
	$("#bidTime").text(data.bidTime)
	$("#maxPeople").text(data.maxPeople)

	max_people = data.maxPeople;

	$(".with-auction").show();
	$(".without-auction").hide();

}

function endAuction() {
	$("#joinBtn").prop('disabled', true);
	$("#createRoomBtn").prop('disabled', false);
	$("#loginForm").prop("action", "/createRoom");
	
	$("#itemName").text('')
	$("#itemDesc").text('')
	$("#startPrice").text('')
	$("#autobuyPrice").text('')
	$("#bidTime").text('')
	$("#maxPeople").text('')

	$(".with-auction").hide();

	$(".auction-message").text('No auctions ongoing')
	$(".without-auction").show();
}

function ongoingAuction(data) {
	$("#joinBtn").prop('disabled', true);
	$("#createRoomBtn").prop('disabled', true);

	
	$(".with-auction").hide();
	$(".auction-message").text('Auction currently ongoing. Please wait for the next auction.')
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