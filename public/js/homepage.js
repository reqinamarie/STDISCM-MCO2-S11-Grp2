
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


    var imgItem = document.getElementById('itemImage');
	imgItem.src = data.photo;
    console.log("data.photo", data.photo);
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
