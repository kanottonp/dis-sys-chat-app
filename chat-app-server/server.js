const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const port = process.env.PORT || 3333

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const User = require('./models/user.js');
const Message = require('./models/message.js');

server.listen(port, function() {
    console.log(`listening on ${port}`)
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    console.log("a user connected");
	
    // socket.on('chat message', function(msg) {
        // console.log('MSG : ' + msg.text);
		// io.emit('chat message', msg);
    // });
	
	socket.on('send', function(msg) {
		console.log('sending message');
		console.log(msg);
		var newMsg = new Message();
		var thisUser = new User();
		thisUser.username = msg.user;
		newMsg.user = thisUser;
		newMsg.text = msg.message;
		newMsg.createdAt = new Date();
		// newMsg.save(function(err) {
			// if (err){
				// console.log('Error in Saving user: '+err);  
				// throw err;  
			// }
			// console.log('User Registration succesful');    
			// return done(null, newUser);
		// });
		io.emit('chat message', newMsg);
    });
});