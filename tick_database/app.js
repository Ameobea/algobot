var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var ws = require("nodejs-websocket");
var fs = require('fs');
var http = require('http');

var index = require('./routes/index');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(3003)
console.log("Tick database started!");

app.use(logger('dev'));
app.use(cookieParser());

app.use('/', index);

var socket = ws.connect("ws://localhost:7507/");
socket.on("error", function(err){
	console.log("Error in simulation injection socket: ");
	console.log(err);
});
socket.on("text", function(text){ //TODO: Set handlers for different data types being sent back.
	var parsed = JSON.parse(text);
	if(parsed.type == "new_tick"){

	}
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		console.log(err.stack);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

app.use(function(req, res, next) {
  res.status(404).send('Resource not found');
});

module.exports = app;
