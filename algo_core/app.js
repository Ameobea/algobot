var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var ws = require("nodejs-websocket");
var fs = require('fs');
var http = require('http');

var index = require('./routes/index');
var backtest = require("./routes/backtest");

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(3001)
console.log("Tick reader started!");

app.use(logger('dev'));
app.use(cookieParser());

app.use('/', index);

var socket_server = ws.createServer(function(conn){
	socket_server.on("error", function(err){
		console.log("Websocket server had some sort of error:");
		console.log(err);
	});
	conn.on("text", function(input){ //TODO: Set handlers for different data types being sent back.
		socket_server.connections.forEach(function(connection){
			connection.sendText(input);
		});
	})
	conn.on("close",function(code,reason){
		//console.log("Websocket connection closed");
	});
}).listen(7507);

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
