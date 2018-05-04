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
// app.use(cors)

//Database Access

var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});

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

    if (username.trim() === '') {
        return (
            res.status(400).json({ "message": "Can't be a blank space" })
        )
    }

    var newUser = new User();
    newUser.username = username;

    // console.log(username);
    User.findOne({ 'username': newUser.username }, (err, result) => {
        if (!err) {
            if (!result) {
                // Create and Save it
                newUser.save(function(err, resultt) {
                    if (err) {
                        console.log(err);
                        res.status(500).send();
                    } else {
                        console.log('new user');
                        res.status(200).json(resultt)
                    }
                })
            } else {
                console.log('existing user');
                res.status(200).json(result)
            }

        } else {
            console.log(err);
            res.status(500).send();
        }
    });

});

app.get('/group/:groupid', function(req, res) {

    var groupid = req.params.groupid

    Group.findOne({ _id: groupid }, (err, result) => {
        if (!err) {
            if (!result) {
                res.status(404).send("Group not found")
            } else {
                res.status(200).json(result)
            }
        } else {
            console.log(err)
            res.status(500).send("Internal Error")
        }
    })

})
app.get('/user/:username', function(req, res) {

    var username = req.params.username

    User.findOne({ 'username': username }, (err, result) => {
        if (!err) {
            if (!result) {
                res.status(404).send("User not found")
            } else {
                res.status(200).json(result)
            }
        } else {
            console.log(err)
            res.status(500).send("Internal Error")
        }
    })

})




app.get('/findgroup', function(req, res) {
    console.log('finding group')
    Group.find()
        .then((doc) => {
            res.json(doc)
        })

})

app.post('/creategroup', function(req, res) {
    console.log('create group')
    var username = req.body.username
    var groupname = req.body.groupname

    if (username.trim() === '') {
        return (
            res.status(400).json({
                "message": "Session Timeout"
            })
        )
    }

    User.findOne({ 'username': username }, (err, result) => {
        var userid;
        if (!err) {
            if (!result) {
                res.status(500).send("Username is not existed")
            } else {
                // console.log(result);
                console.log("Passed")
            }
        } else {
            console.log(err);
            res.status(500).send();
        }
    }).then((result) => {
        var userid = result._id
        console.log(userid)
        var newGroup = new Group()
        newGroup.name = groupname
        newGroup.users = [userid]

        Group.findOne({ 'name': newGroup.name }, (err, resultt) => {
            // console.log(resultt)
            if (!err) {
                if (!resultt) {
                    // Create and Save it
                    newGroup.save(function(err, ressult) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Can't Create Group");
                        } else {
                            console.log('create new Group');

                            var groupid = ressult._id
                            if (groupid !== null) {
                                User.findOneAndUpdate({ 'username': username }, { '$push': { 'groups': groupid } }, function(err) {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send("Can't Add Group");
                                    } else {
                                        console.log('add group to user')
                                        res.status(200).send(`${newGroup.name} is created`)
                                    }
                                })
                            }
                        }
                    })
                } else {
                    console.log('existing group');
                    res.status(500).send(`${newGroup.name} is already existed`)
                }

            } else {
                console.log(err);
                res.status(500).send(`Some error is occured`);
            }
            // console.log(resultt)
        });
    })

})

app.post('/joingroup', function(req, res) {
    var username = req.body.username
    var groupid = req.body.groupid

    if (username.trim() === '') {
        return (
            res.status(400).json({
                "message": "Session Timeout"
            })
        )
    }

    if (username !== null && groupid !== null) {
        User.findOneAndUpdate({ 'username': username }, { '$push': { 'groups': groupid } }, (err, result) => {
            if (!err) {
                if (!result) {
                    res.status(500).send("Username is not existed")
                } else {
                    // console.log(result);
                    console.log("Passed")
                }
            } else {
                console.log(err);
                res.status(500).send();
            }
        }).then((result) => {
            var userid = result._id
            Group.findOneAndUpdate({ '_id': groupid }, { '$push': { 'users': userid } }, (err, resultt) => {
                if (!err) {
                    if (!resultt) {
                        res.status(500).send("Group is not existed")
                    } else {
                        res.status(200).send("Join Group Success")
                    }
                } else {
                    console.log(err)
                    res.status(500).send("Internal Error")
                }
            })
        })
    }
})

app.post('/leavegroup', function(req, res) {
    var username = req.body.username
    var groupname = req.body.groupname

    if (username.trim() === '') {
        return (
            res.status(400).json({
                "message": "Session Timeout"
            })
        )
    }

    User.findOne({ 'username': username }, (err, result) => {
        if (!err) {
            if (!result) {
                res.status(500).send("User not found")
            } else {
                var userid = result._id
                Group.findOneAndUpdate({ 'name': groupname }, { '$pull': { 'users': userid } }, (errr, resultt) => {
                    if (!err) {
                        if (!resultt) {
                            res.status(500).send("Group is not existed")
                        } else {
                            console.log("Group leaves User")
                        }
                    } else {
                        console.log(err)
                        res.status(500).send("Internal Error")
                    }
                })
            }
        }
    })

    Group.findOne({ 'name': groupname }, (err, result) => {
        if (!err) {
            if (!result) {
                res.status(500).send("Group not found")
            } else {
                var groupid = result._id
                User.findOneAndUpdate({ 'username': username }, { '$pull': { 'groups': groupid } }, (errr, resultt) => {
                    if (!err) {
                        if (!resultt) {
                            res.status(500).send("User is not existed")
                        } else {
                            console.log('User Leaves Group')
                            res.status(200).send("Leaves Group Success")
                        }
                    } else {
                        console.log(err)
                        res.status(500).send("Internal Error")
                    }
                })
            }
        }
    })

})

app.post('send/message', function(req, res) {
    var username = req.body.username
    var username = req.body.username
})







//Live Chat

var io = require('socket.io').listen(server);

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