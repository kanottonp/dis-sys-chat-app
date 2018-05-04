var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

const port = process.env.PORT || 2222;
var app = express();

var server = app.listen(3001, function() {
    console.log('Listening on port ' + port);
});

var io = require('socket.io').listen(server);
io.on('connection', function (client) {
  console.log('user connected.');
  
	client.on('send',function(msg) {
		var d = new Date();
		console.log({ text: msg.message, createdAt : d})
		io.emit('chat message', { text: msg.message, createdAt : d , username:msg.username});
	});
});
global.io = io;

// controllers
var indexController = require('./controllers/index');

app.use(cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

var server = app.listen(port, function() {
    console.log('Listening on port ' + port);
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexController);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
