var express = require('express');
var router = express.Router();
var redis = require('redis');
var conf = require('../../conf/conf');
var client = redis.createClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});
client.on('error', function (err) {
  console.log('Error ' + err);
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/reset_db', function(req, res, next){
	client.flushall(function(){
		res.send("Database successfully wiped.");
	})
})

module.exports = router;