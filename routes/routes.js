function routes(io) {
	const express = require('express')
	const homeController = require('../controllers/homeController')(io)

	const app = express();
	module.exports = app

	app.get('/', homeController.home);
	app.get('/chatroom', homeController.getChatroom);
	app.get('/createRoom', homeController.newRoom);
	app.get('/chatroomHost', homeController.getChatroomHost);

}