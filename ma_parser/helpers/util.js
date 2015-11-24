var util = exports;
var iSet = require('../../db/indexed_set');
var client = require('../../db/util').client();

util.processSmaData = function(message){
  processed = JSON.parse(message);
  util.calcDerivs(processed.data.symbol, processed.data.timestamp, processed.data.period, processed.data.value);
}

util.calcDerivs = function(ticker, timestamp, range, curPrice){
  var processed = [];
  iSet.append('sma_deriv_'+ticker, 'timestamps', timestamp, function(derivIndex){
    for(var i=1;i<3;i++){ // Eventually replace this with a dynamically generated list of derivatives to generate instead of a static list.
      for(var o=1;o<3;o++){
        if(processed.indexOf(o*i) == -1){
          processed.push(o*i);
          //range = period of the sma data being used, o*i*10 = lookup point of past data to calculate
          util.calcSmaDeriv(ticker, range, timestamp, o*i*10, Math.round(curPrice*100000)/100000, derivIndex); // queue the derivative calculation.
        }
      }
    }
  });
}

util.calcSmaDeriv = function(ticker, range, timestamp, period, curPrice, derivIndex){// return all indexes within 1 second of the desired time
  iSet.rangeByElement('sma_'+ticker, 'timestamps', timestamp-period-1, timestamp-period+1, function(indexes, values){ // returns all timestamps within given range of the given timestamp.
    var minDiff = Math.abs((timestamp-period)-values[0]);
    var minIndex = indexes[0];
    for(var i=0;i<values.length;i++){ // find the index of the timestamp with the smallest time difference from the given timestamp.  
      if(Math.abs((timestamp-period)-values[i]) < minDiff){
        minDiff = Math.abs((timestamp-period)-values[i]);
        minIndex = indexes[i];
      }
      if(i+1 == values.length){
        iSet.get('sma_'+ticker, 'data'+'_'+range, minIndex, function(oldPrice){ // gets the price of the old tick closest to the specified timestamp
          iSet.add('sma_deriv_'+ticker, 'data_'+range+"_"+period, derivIndex, (((curPrice-oldPrice)/period)*100000), function(){
            client.publish('sma_derivs', JSON.stringify({type:'sma_deriv',data:{symbol:ticker, timestamp:timestamp, ma_period:range, deriv_range:period, value:(((curPrice-oldPrice)/period)*100000)}}));
          });
        });
      }
    }
  });
}