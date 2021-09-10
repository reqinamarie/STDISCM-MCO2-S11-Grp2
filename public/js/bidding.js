socket.on('new-bid', (bid, user) => {
	var name = user.fName + " " + user.lName, 
		email = "(" + user.email + ")"

    $('#output').append('<p> -> <em>' + name + ' ' + email + ' bid <b>PHP ' + bid + '</b>.</em></p>');
    $('#currBid').text(bid)
    $('#currBidder').text(user.email)
})

socket.on('autobuy', (bid, user) => {
	var name = user.fName + " " + user.lName, 
		email = "(" + user.email + ")"

    $('#output').append('<p> -> <em>' + name + ' ' + email + ' bid the autobuy price of PHP ' + bid + '.</em></p>');

    $('#output').append('<p> -> <em><strong>' + name + '  won the auction.</strong></em></p>');
})

socket.on('disconnected', (email) => {

	$("#output").append('<p> -> <em> ' + email + ' left the chatroom.</em></p>')
})

socket.on('rollback', (bid) => {
	if (bid == null) {
		$("#output").append('<p style="color: #DC143C"> -> <em>The top bid is rolled back. There are no more bids.</em></p>')

	    $('#currBid').text('-')
	    $('#currBidder').text('-')
		return;
	}

	var name = bid.user.fName + " " + bid.user.lName, 
		email = " (" + bid.user.email + ")"

	$("#output").append('<p style="color: #DC143C"> -> <em>The top bid is rolled back to PHP ' + bid.bid + ' by ' + name + email + '.</em></p>')

    $('#currBid').text(bid.bid)
    $('#currBidder').text(bid.user.email)
})

$(document).ready(function() {	
	$("input").on('focusout', function() {
		if (this.checkValidity())
			$(this).css('border-color', 'darkgrey')
		else
			$(this).css('border-color', 'red')
	})

	$("#bidBtn").on('click', function() {
		if (document.getElementById('bid').checkValidity()) {
			var bid = $("#bid").val()

			socket.emit('bid', bid, user, (success) => {
				if (!success)
					$('#output').append('<p style="color: darkgrey"> -> <em>Your bid of PHP ' + bid + ' is not higher than the current bid.</em></p>');
			})
			$("#bid").val('')
		}
	})

	$("#autobuyBtn").on('click', function() {
		socket.emit('autobuy', user)
	})
})