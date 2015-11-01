var db = exports;
var conf = require('../conf/conf');
var client = redis.createClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});
client.on('error', function (err) {
  console.log('Error ' + err);
});

db.processTick = function(symbol, timestamp, ask, bid){
	client.
}