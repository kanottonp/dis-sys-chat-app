var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var username = '';

//const mongoose = require('mongoose');
//mongoose.connect("mongodb://localhost:27017/dis-sys-chat-app");


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('New Connection');
  
  socket.on('chat message', function(msg){
	console.log('MSG : ' + msg);
    //io.emit('chat message', msg);
  });
  
  /* socket.on('send', function(data) {
	console.log('sending message');
	console.log(data);
	io.sockets.in(data.group).emit('chat', { 'user':data.user, 'message':data.message });
	}); */
  
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
