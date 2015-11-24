var db = exports;
var redis = require('redis');
var returnClient = function(config){
  return redis.createClient(config).on('error', function(err) {console.log(err)});
}
var conf = require('../conf/conf');
var client = returnClient({host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password});

db.client = function(){
  return returnClient(
    {host:conf.redis_host, port:conf.redis_port, auth_pass:conf.redis_password}
  );
}