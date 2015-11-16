/*
This file has the purpose of defining functions that interface with the redis database.  
It especially has 
*/

var db = exports;
var client = require('../../conf/conf').client();

/*
Returns an array of the elements within a certain range on either side of the given element (numerically) for the given set.  
This array will be in the format [index0, element0, index1, element1, etc.]
*/
db.getElementsInRange = function(range, setName, element, callback){
  client.zrangebyscore(setName, (element-range)-1, (element-range)+1, 'WITHSCORES', function(err,indexes){
    callback(indexes);
  });
}

//Returns the number of elements in the set with the given name.
db.getSetLength = function(setName, callback){
  client.zcard(setName,function(err,res){
    callback(res);
  })
}

//Appends an item to the end of a set with members consisting of index numbers and scores consisting of the data being stored.  
//Returns the index of the added element.
db.appendIndexedItem = function(setName, score, callback){
  db.getSetLength(setName, function(setLength){
    client.zadd(setName, score, setLength, function(){
      callback(setLength);
    });
  });
}

//Returns the index of an element in an indexed set given the element.
db.getIndexByElement = function(setName, element, callback){
  client.zrangebyscore(setName, element, element, 'WITHSCORES', function(err,index){
    callback(index[0]);
  });
}

//Returns the element at the corresponding index in an indexed set.
db.getElementByIndex = function(setName, index, callback){
  client.zscore(setName, index, function(err,element){
    callback(element);
  });
}

//Adds the specified element to the specified set with the specified index.
db.addElement = function(setName, element, index){
  client.zadd(setName, element, index, function(){});
}