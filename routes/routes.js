const express = require('express')
const homeController = require('../controllers/homeController')
//const loginController = require('../controllers/LoginController.js');

const app = express();

app.get('/', homeController.home);
app.post('/chatroom', homeController.postLogin);
// app.post('/createRoom', homeController.newRoom);
app.get('/createRoom', homeController.newRoom);		//	delete after testing
app.get('/chatroomHost', homeController.getChatroomHost);
app.get('*', homeController.redirectHome);

module.exports = app