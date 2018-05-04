const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3333;

var Message = require('./models/message.js');
var Group = require('./models/group.js');
var User = require('./models/user.js');



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/boobooline')


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});

var io = require('socket.io').listen(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/landing', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', function(req, res) {
	console.log('login page');
	console.log(req.body);
    var username = req.body.username;

    var newUser = new User();
    newUser.username = username;
	
	console.log(username);
    User.findOne({ 'username': newUser.username }, (err, result) => {
        // console.log('hello1')
        if (!err) {
            // console.log('hello2')
            // If the document doesn't exist
            if (!result) {
                // console.log('hello3')
                // Create and Save it
                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                        //res.status(400).send();
                    } else {
						console.log('new user');
                        //res.status(200).send(`${newUser.username} is Registered `);
                    }
                })
            } else {
				console.log('exisiting user');
                //res.status(200).send(`${newUser.username} is logging in `);
            }

        } else {
            console.log(err);
            //res.status(500).send();
        }
    });
	
	res.redirect('/');

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