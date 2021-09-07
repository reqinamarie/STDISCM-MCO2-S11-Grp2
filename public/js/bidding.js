socket.on('start-auction', (bidTime) => {
	$("input").prop('disabled', false)
})

socket.on('bid', (bid, user) => {
	var name = user.fName + " " + user.lName + " (" + user.email + ")"

    $('#output').append('<p> -> <em><strong>' + name + ' </strong> bid <strong>PHP ' + bid + '</strong>.</em></p>');
})

socket.on('autobuy', (bid, user) => {
	var name = user.fName + " " + user.lName + " (" + user.email + ")"

    $('#output').append('<p> -> <em><strong>' + name + ' </strong> bid the autobuy price of <strong>PHP ' + bid + '</strong>.</em></p>');
    $('#output').append('<p> -> <em><strong>' + name + ' </strong> won the auction.</em></p>');
})

$(document).ready(function() {
	$("#bidBtn").on('click', function() {
		if (document.getElementById('bid').checkValidity()) {
			var bid = $("#bid").value()

			socket.emit('bid', bid, user)
		}
	})

	$("#autobuyBtn").on('click', function() {
		socket.emit('autobuy', user)
	})
})