var User = require('../models/user');

function(req, username, done) {
	findOrCreateUser = function(){
		// find a user in Mongo with provided username
		User.findOne({ 'username' :  username }, function(err, user) {
			// In case of any error, return using the done method
			if (err){
				console.log('Error in SignUp: '+err);
				return done(err);
			}
			// already exists
			if (user) {
				//มีอยู่แล้ว เข้าไปดึง db
				//return done(null, false, req.flash('message','User Already Exists'));
			} else {
				// create the user
				var newUser = new User();

				// set the user's local credentials
				newUser.username = username;

				// save the user
				newUser.save(function(err) {
					if (err){
						console.log('Error in Saving user: '+err);  
						throw err;  
					}
					console.log('User Registration succesful');    
					return done(null, newUser);
				});
			}
		});
	};
	// Delay the execution of findOrCreateUser and execute the method
	// in the next tick of the event loop
	process.nextTick(findOrCreateUser);
})