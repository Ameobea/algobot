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
  client.zcard("sma_deriv_timestamps_"+ticker, function(err,derivIndex){
    client.zadd("sma_deriv_timestamps_"+ticker, timestamp, derivIndex, function(){
      client.zrangebyscore("tick_timestamps_"+ticker, timestamp, timestamp, "WITHSCORES", function(err,curIndex){ // gets the index of the timestamp being compared
        client.zscore("tick_asks_"+ticker, curIndex[0], function(err,curPrice){ // gets the price of the asset at the timestamp being calculated
          for(var i=1;i<6;i++){
            for(var o=1;o<6;o++){
              if(processed.indexOf(o*i) == -1){
                //console.log(o*i);
                processed.push(o*i);
                util.calcSmaDeriv(ticker, timestamp, o*i*10, Math.round(curPrice*100)/100, derivIndex);
              }
            }
          }
        });
      });
    });
  });
}

util.calcSmaDeriv = function(ticker, timestamp, period, curPrice, derivIndex){
  client.zrangebyscore("tick_timestamps_"+ticker, (timestamp-period)-1, (timestamp-period)+1, "WITHSCORES", function(err,indexes){ // return all indexes within 1 second of the desired time
    //console.log(indexes);
    var minDiff = Math.abs((timestamp-period)-indexes[1]);
    var minIndex = indexes[0];
    for(var i=1;i<indexes.length;i=i+2){
      //console.log(period);
      //console.log(minDiff);
      //console.log(indexes[i], timestamp);
      if(Math.abs((timestamp-period)-indexes[i]) < minDiff){
        minDiff = Math.abs((timestamp-period)-indexes[i]);
        minIndex = indexes[i-1];
        //console.log(minIndex);
      }
      if(i+1 == indexes.length){
        //console.log(minIndex);
        //client.zscore("tick_asks_"+ticker,)
        client.zscore("tick_asks_"+ticker, minIndex, function(err, oldPrice){ // gets the price of the old tick closest to the specified price
          //console.log(period, curPrice, oldPrice, timestamp);
          //console.log((curPrice-oldPrice)/((timestamp-period)-timestamp));
          client.zadd("sma_deriv_data_"+ticker+"_"+period, (curPrice-oldPrice)/((timestamp-period)-timestamp), derivIndex, function(){});
        });
      }
    }
    //console.log(minIndex);
  });
}