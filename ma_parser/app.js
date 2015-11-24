/*
ma_parser module
This module listens for published moving average calculations.  It then uses that data to calculate
moving average derivative data that is used to determine the average rate of change of prices over different
time invervals.

In addition, it uses moving average data to calculate the times and prices at which moving averages cross
each other, which can be used to determine price trends and reversals.  
*/

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//I'd love to move this use of client to the db module, but I'm not sure how to do that.
var client = require('../db/util').client();

var util = require('./helpers/util');
var index = require('./routes/index');
var conf = require('../conf/conf');

var app = express();

client.subscribe('tick_mas');
client.on('message', function(channel, message){
	util.processSmaData(message);
});

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(3001)
console.log('Moving average parser started!');

app.use(logger('dev'));
app.use(cookieParser());

app.use('/', index);

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
