var db = exports;
var conf = require('../conf/conf');
var client = redis.createClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});
client.on('error', function (err) {
  console.log('Error ' + err);
});

/*
This function is called every time a new tick is recieved.  
Its job is to call all other functions that perform calculations every time a new tick is recieved.  
*/
db.processTick = function(symbol, timestamp, ask, bid){
	calcSMAs(timestamp, symbol);
}

db.calcSMAs = function(timestamp, symbol){
	calcSMA(timestamp, symbol, 5);
}

db.calcSMA = function(timestamp, symbol, range){
	client.zrangebyscore("tick_bids_"+symbol.toLowerCase(),timestamp-range,timestamp,function(vals){
		console.log(vals);
		var total = 0;
		var last;
		for(var i=0;i<vals.length;i++){
			if(i==0){
				client.zscore("tick_bids_"+symbol.toLowerCase(),vals[i],function(score){
					var diff = score-(timestamp-range);
					total += diff*vals[i];
					last = score;
				});
			}else{
				client.zscore("tick_bids_"+symbol.toLowerCase(),vals[i],function(score){
					var diff = score-last;
					total += diff*vals[i];
					last = score;
				});
			}
		}
		console.log(total/vals.length);
	});
}