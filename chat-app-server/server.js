const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const port = process.env.PORT || 3333

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(port, function() {
    console.log(`listening on ${port}`)
})

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    console.log("a user connected")
    socket.on('chat message', function(msg) {
        console.log('MSG : ' + msg);
    })
})