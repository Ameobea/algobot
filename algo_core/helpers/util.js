var ws = require("nodejs-websocket");
//var Promise = require('promise');
var redis = require('redis');
var conf = require('../../conf/conf');
var client = redis.createClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});
client.on('error', function (err) {
  console.log('Error ' + err);
});
var util = exports;

util.processSmaData = function(message){
  processed = JSON.parse(message);
  //console.log(processed);
  util.calcDerivs(processed.data.symbol, processed.data.timestamp);
}

util.calcDerivs = function(ticker, timestamp){
  var processed = [];
  client.zcard("sma_deriv_timestamps_"+ticker, function(err,index){
    client.zadd("sma_deriv_timestamps_"+ticker, function(){
      for(var i=1;i<5;i++){
        for(var o=1;o<5;o++){
          if(processed.indexOf(o*i) == -1){
            processed.push(true);
            util.calcSmaDeriv(ticker, timestamp, o*i, index);
          }
        }
      }
    });
  });
}

util.calcSmaDeriv = function(ticker, timestamp, period){
  client.zrangebyscore("tick_timestamps_"+ticker, (timestamp-period)-1, (timestamp-period)+1, "WITHSCORES", function(err,indexes){ // return all indexes within 1 second of the desired time
    //console.log(indexes);
    var minDiff = indexes[1]-timestamp;
    var minIndex = 1;
    //var promLoop = new Promise(function(resolve, reject){
    for(var i=1;i<indexes.length;i=i+2){
      if(indexes[i]-timestamp < minDiff){
        minDiff = indexes[i]-timestamp;
        minIndex = i;
      }
    }
    console.log(minIndex);
    //});
    client.zscore("tick_asks_"+ticker, Math.round(indexes[minIndex]*100)/100, function(err,val){
      //client.zadd("sma_deriv_data_"+ticker+"_"+period, )
    });
  });
}