const express = require('express')
const homeController = require('../controllers/homeController')
//const loginController = require('../controllers/LoginController.js');

const app = express();
module.exports = app

app.get('/', homeController.home);
app.get('/chatroom', homeController.getChatroom);
app.get('/createRoom', homeController.newRoom);