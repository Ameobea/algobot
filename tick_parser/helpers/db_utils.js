var db = exports;
var iSet = require('../../db/indexed_set');
var dbutil = require('../../db/util');
var client = dbutil.client();

/*
This function is called every time a new tick is recieved.  
Its job is to call all other functions that perform calculations every time a new tick is recieved.  
*/
db.processTick = function(symbol, timestamp, ask, bid){
  db.calcSMAs(timestamp, symbol);
}

db.calcSMAs = function(liveTimestamp, symbol){ // eventually optimise to grab all the ticks at once with one db access and split them to the individual calculations.
  iSet.append('sma_'+symbol, 'timestamps', liveTimestamp, function(liveIndex){
    db.calcSMA(liveTimestamp, symbol, 5, liveIndex);
    db.calcSMA(liveTimestamp, symbol, 15, liveIndex);
    db.calcSMA(liveTimestamp, symbol, 200, liveIndex);
  });
}

db.calcSMA = function(liveTimestamp, symbol, range, liveIndex){
  iSet.rangeByElement('ticks_'+symbol.toLowerCase(), 'timestamps', liveTimestamp-range, liveTimestamp, function(indexes,timestamps){
    iSet.rangeByIndex('ticks_'+symbol.toLowerCase(), 'bids', indexes[0], indexes[indexes.length-1], function(prices){
      console.log
      db.avgStep(indexes, symbol, liveTimestamp, range, timestamps, prices, liveIndex);
    });
  });
}

db.avgStep = function(indexes, symbol, liveTimestamp, range, timestamps, prices, liveIndex){
  var total = 0;
  for(var i=0;i<timestamps.length;i++){
    if(i==0){ // the first element of prices is not a part of the prices being averaged but instead the one that came before.
      total += (timestamps[0]-(liveTimestamp-range))*prices[0];
    }else{
      total += (timestamps[i]-timestamps[i-1])*prices[i+1];
    }
    if(i+1==timestamps.length){
      iSet.add('sma_'+symbol, 'data'+'_'+range, liveIndex, total/range, function(){
        client.publish('tick_mas', JSON.stringify({type:'sma',data:{symbol:symbol,timestamp:liveTimestamp,period:range,value:(total/range)}}));
      });
    }
  }
}

