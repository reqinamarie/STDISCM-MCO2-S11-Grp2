const express = require('express')
const homeController = require('../controllers/homeController')
//const loginController = require('../controllers/LoginController.js');

const app = express();

app.get('/', homeController.home);
app.get('/chatroom', homeController.getChatroom);
app.get('/createRoom', homeController.newRoom);
app.get('/chatroomHost', homeController.getChatroomHost);

module.exports = app