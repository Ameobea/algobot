var util = exports;
var db = require('./db_util')

util.processSmaData = function(message){
  processed = JSON.parse(message);
  util.calcDerivs(processed.data.symbol, processed.data.timestamp, processed.data.period);
}

util.calcDerivs = function(ticker, timestamp, range){
  var processed = [];
  db.appendIndexedItem('sma_deriv_timestamps_'+ticker, timestamp, function(derivIndex){
    db.getIndexByElement('sma_timestamps_'+ticker, timestamp, function(index){
      db.getElementByIndex('sma_data_'+ticker+'_'+range, index, function(curPrice){
        for(var i=1;i<6;i++){ // Eventually replace this with a dynamically generated list of derivatives to generate instead of a static list.
          for(var o=1;o<6;o++){
            if(processed.indexOf(o*i) == -1){
              processed.push(o*i);
              util.calcSmaDeriv(ticker, range, timestamp, o*i*10, Math.round(curPrice*100000000)/100000000, derivIndex); // queue the derivative calculation.
            }
          }
        }
      });
    });
  });
}

util.calcSmaDeriv = function(ticker, range, timestamp, period, curPrice, derivIndex){// return all indexes within 1 second of the desired time
  db.getElementsInRange(1,'sma_timestamps_'+ticker,timestamp,function(timestamps){ // returns all timestamps within given range of the given timestamp.
    var minDiff = Math.abs((timestamp-period)-timestamps[1]);
    var minIndex = timestamps[0];
    for(var i=1;i<timestamps.length;i=i+2){ // find the index of the timestamp with the smallest time difference from the given timestamp.  
      if(Math.abs((timestamp-period)-timestamps[i]) < minDiff){
        minDiff = Math.abs((timestamp-period)-timestamps[i]);
        minIndex = timestamps[i-1];
      }
      if(i+1 == timestamps.length){
        db.getElementByIndex('sma_data_'+ticker+'_'+range, minIndex, function(oldPrice){ // gets the price of the old tick closest to the specified timestamp
          db.addElement('sma_deriv_data_'+ticker+'_'+period, ((curPrice-oldPrice)/((timestamp-period)-timestamp))*100000000000, derivIndex);
        });
      }
    }
  });
}