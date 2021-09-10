function startBid() {
    document.getElementById("startTime").disabled = true;
 	socket.emit('start-auction', (started) => {
 		if (!started) {
 			document.getElementById("startTime").disabled = false;
 		}
 	})   
}

socket.on('fail-start-auction', ()=> {
    $('#output').append('<p style="color: #DC143C"> -> <em><strong>Auction failed to start. Please try again.</strong></em></p>');
})

