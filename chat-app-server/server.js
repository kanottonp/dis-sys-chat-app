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
app.use(cors())

// Database Access

/*                                         --* List of this SPAGETTI API *--

    GET GROUP BY ID | Path : '/group' , Query : ':groupid' , Body : -
    GET USER BY USERNAME | Path : '/user' , Query : ':username' , Body : -
    GET ALL GROUP | Path : '/findgroup', Param: - , Body: -

    POST LOGIN | Path : '/login' , Params : - , Body : { 'username' : username }
    POST CREATE GROUP | Path : '/creategroup' , Params : - , Body : { 'username' : username, 'groupname' : groupname }
    POST JOIN GROUP BY NAME | Path : '/joingroup' , Params : - , Body : { 'username' : username, 'groupname' : groupname }
    POST LEAVE GROUP BY NAME | Path : '/leavegroup' , Params : - , Body : { 'username' : username, 'groupname' : groupname }
    POST SEND MESSAGE | Path : '/send/message' , Params : - , Body : { 'username' : username, 'groupid' : groupid, 'message' : message } */



var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
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

app.get('/group', function(req, res) {

    var groupid = req.query.params

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
app.get('/user', function(req, res) {

    var username = req.query.params

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
    var groupname = req.body.groupname

    if (username.trim() === '') {
        return (
            res.status(400).json({
                "message": "Session Timeout"
            })
        )
    }

    if (username !== null && groupname !== null) {
        Group.findOne({ 'name': groupname }, (err, resultt) => {
            if (!err) {
                if (!resultt) {
                    return (res.status(404).send("Group Not Found"))
                } else {
                    console.log("Found Group")
                }
            }
        }).then((resultt) => {
            var groupid = resultt._id
            User.findOneAndUpdate({ 'username': username }, { '$addToSet': { 'groups': groupid } }, (err, result) => {
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
                            res.status(200).json(resultt)
                        }
                    } else {
                        console.log(err)
                        res.status(500).send("Internal Error")
                    }
                })
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

app.post('/send/message', function(req, res) {
    // var username = req.body.username
    // var groupid = req.body.groupid
    // var message = req.body.message
    // var userid;
    // var lastmessages = -99;


    // (async() => {

    //     var userid = (await User.findOne({ 'username': username }))._id;
    //     var lastmessages = (await Group.findOne({ '_id': groupid })).lastmessages;

    //     console.log(userid)
    //     console.log(lastmessages)

    //     var mes = new Message()
    //     mes.user = userid
    //     mes.text = message
    //     mes.number = lastmessages + 1
    //     mes.group = groupid

    //     var result = (await new Promise((resolve, reject) => {
    //         mes.save((err, result) => {
    //             if (err) {
    //                 console.log(err);
    //                 res.status(500).send("Error When Save");
    //             } else {
    //                 console.log('New Message');
    //                 // res.status(200).json(result)
    //             }
    //             resolve(result);
    //         })
    //     }));

    //     Group.findOneAndUpdate({ '_id': groupid }, {
    //         '$push': { 'messages': result._id },
    //         '$set': { 'lastmessages': lastmessages + 1 }
    //     }, (err, result) => {
    //         if (!err) {
    //             if (!result) {
    //                 return (res.status(500).send("Can't Send Message"))
    //             } else {
    //                 console.log('Send Message')
    //                 return (res.status(200).json(result))
    //             }
    //         } else {
    //             console.log(err)
    //             return (res.status(500).send("Internal Error"))
    //         }
    //     })


    // })();

    res.status(200).send("Send Completed")
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
        console.log('sending message via 1');
        console.log(msg);
        var newMsg = new Message();
        var thisUser = new User();
        thisUser.username = msg.username;
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
