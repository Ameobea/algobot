//See readme.md for additional reference

var iSet = exports;
var client = require('./util').client();

//Returns the element at the given index in the given column of the given indexed set
iSet.get = function(setName, column, index, callback){
  client.zscore(setName+"_"+column, index, function(err,element){
    callback(element);
  });
}

//Returns an array of all indexes in the given column that are equal to the given value
iSet.getIndex = function(setName, column, value, callback){
  client.zrangebyscore(setName+"_"+column, value, value, function(err,indexes){
    callback(indexes);
  });
}

/*
Returns the indexes and values of all elements in the
given column that are numerically between the two given values.  
The results are returned in two arrays; the first contains
the indexes and the second contains the values.
*/
iSet.rangeByElement = function(setName, column, value1, value2, callback){
  client.zrangebyscore(setName+"_"+column, value1, value2, 'WITHSCORES', function(err,indexes){
    var temp1 = [];
    var temp2 = [];
    for(var i=0;i<indexes.length;i++){
      if(i%2==0){
        temp1.push(indexes[i]);
      }else{
        temp2.push(indexes[i]);
      }
      if(i+1==indexes.length){
        callback(temp1,temp2);
      }
    }
  });
}

//Returns the values of all elements in the given range of indexes
iSet.rangeByIndex = function(setName, column, index1, index2, callback){
  client.zrange(setName+"_"+column, index1-1, index2, 'WITHSCORES', function(err,res){
    var temp = [];
    for(var i=0;i<res.length;i++){
      if(i%2==1){
        temp.push(res[i]);
      }
      if(i+1==res.length){
        callback(temp);
      }
    }
  });
}

//Adds the given value at the given index in the given column to the given indexed set
iSet.add = function(setName, column, index, value, callback){
  client.zadd(setName+"_"+column, value, index, function(){
    if(callback){
      callback(true);
    }
  });
}

//Adds the given value to the end of the given column in the given set and returns the index at which it was added
iSet.append = function(setName, column, value, callback){
  iSet.getLength(setName, column, function(len){
    client.zadd(setName+"_"+column, value, len, function(){
      callback(len);
    });
  });
}

//Returns the number of elements in the given column
iSet.getLength = function(setName, column, callback){
  client.zcard(setName+"_"+column, function(err,len){
    callback(len);
  })
}