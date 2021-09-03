const express = require('express')
const homeController = require('../controllers/homeController')

const app = express();
module.exports = app

app.get('/', homeController.home);