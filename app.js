const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const routes = require('./routes/routes.js');

const app = express()

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/views'))
// hbs.registerPartials(__dirname + '/views/partials')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({extended:true}))

app.use(express.static('public'))
app.use('/', routes)

const port = process.env.PORT || 3000;

const server = app.listen(port, function() {
    console.log('App listening at port ' + port)
})

const socket = require('socket.io');
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
require('./utils/socket')(io);

module.exports = app;