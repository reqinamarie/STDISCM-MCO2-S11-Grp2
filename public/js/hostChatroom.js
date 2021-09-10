function startBid() {
    document.getElementById("startTime").disabled = true;
 	socket.emit('start-auction', (started) => {
 		if (!started) {
 			document.getElementById("startTime").disabled = false;
 		}
 	})   
}

