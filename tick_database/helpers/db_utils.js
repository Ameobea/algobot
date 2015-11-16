var db = exports;
var conf = require('../../conf/conf');
var redis = require('redis');
var client = redis.createClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});
client.on('error', function (err) {
  console.log('Error ' + err);
});

/*
This function is called every time a new tick is recieved.  
Its job is to call all other functions that perform calculations every time a new tick is recieved.  
*/
db.processTick = function(symbol, timestamp, ask, bid){
  db.calcSMAs(timestamp, symbol);
}

db.calcSMAs = function(timestamp, symbol){ // eventually optimise to grab all the ticks at once with one db access and split them to the individual calculations.
  db.calcSMA(timestamp, symbol, 5);
  db.calcSMA(timestamp, symbol, 15);
  db.calcSMA(timestamp, symbol, 200);
}

db.calcSMA = function(timestamp, symbol, range){
  client.zrangebyscore("tick_timestamps_"+symbol.toLowerCase(),timestamp-range,timestamp,"WITHSCORES",function(err,timestamps){
    var temp = []; //timestamps
    var indexes= []; //indexes
    for(var i=0;i<timestamps.length;i++){
      if(i%2 == 1){
        temp.push(Math.round(timestamps[i]*100)/100);
      }else{
        indexes.push(timestamps[i]);
      }
    }
    timestamps = temp;
    //timestamps now is equal to an array of the indexes of all ticks that fit the range
    //indexes now is equal to an array of all the prices of all the ticks that fit the range
    client.zrange("tick_bids_"+symbol.toLowerCase(),indexes[0]-1,indexes[indexes.length-1],"WITHSCORES",function(err,prices){
      var temp = []; //indexes
      for(var i=1;i<prices.length;i=i+2){
        temp.push(Math.round(prices[i]*1000000)/1000000);
      }
      //temp now is an array of prices for each of the ticks starting at the last tick before the start of the range.
      db.avgStep(0,0,indexes,symbol,timestamp,range,timestamps,temp);
    });
  });
}

db.avgStep = function(i, total, rangeArray, symbol, timestamp, range, timestamps, prices){
  if(i==0){
    var diff = timestamps[0]-(timestamp-range); //time diff between the first tick in the range and the previous timestamp out of the range 
    total += diff*prices[0]; //add the weighted price for the segment to the total
    db.avgStep(i+1,total,rangeArray,symbol,timestamp,range,timestamps, prices);
  }else{ //if it's not the first element...
    if(i<rangeArray.length){ //if we're not done...
      if(i<rangeArray.length-1){ //if it's not the last one...
        var diff = timestamps[i]-timestamps[i-1]; //time diff between this point and the last point in the range
        total += diff*prices[i+1];
        if(isNaN(total)){
          console.log(rangeArray.length,i);
        }
        db.avgStep(i+1,total,rangeArray,symbol,timestamp,range,timestamps, prices);
      }else{ //if it is the last one...
        var diff = timestamp-timestamps[i-1]; //time diff between this point and the last point in the range
        total += diff*prices[i+1];
        db.avgStep(i+1,total,rangeArray,symbol,timestamp,range,timestamps, prices);
      }
    }else{
      client.zcard("sma_timestamps_"+symbol, function(err,index){
      	index--;
        client.zadd("sma_timestamps_"+symbol, timestamp, index, function(){
          if(!isNaN(total/range)){
            client.zadd("sma_data_"+symbol+"_"+range, total/range, index, function(){
              client.publish("tick_mas",JSON.stringify({"type":"sma","data":{"symbol":symbol,"timestamp":timestamp,"period":range,"value":(total/range)}}));
            });
          }
        });
      });
    }
  }
}