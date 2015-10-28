var ws = require("nodejs-websocket");
var fs = require('fs');

var util = exports;

util.fastBacktest = function(pair, startTime, diff){
	var socket = ws.connect("ws://localhost:7507/");
	socket.on("error", function(err){
		console.log("Error in simulation injection socket: ");
		console.log(err);
	})

	var index = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/index.csv", {encoding: 'utf8'}, "r", function(err,data){
		var result = [];
		var indexData = data.split("\n");
		for(var i=1;i<indexData.length;i++){
			if(indexData[i].length > 3){
				result.push(indexData[i].split(","));
			}
		}
		for(var i=0;i<result.length;i++){
			if(parseFloat(result[i][2]) > startTime){
				var chunk = parseFloat(result[i][0]);
				break;
			}
		}
		var chunkFile = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/" + pair + "_" + chunk + ".csv", {encoding: "utf8"}, "r", function(err, data){
			var chunkResult = [];
			var chunkData = data.split("\n");
			for(var i=1;i<chunkData.length;i++){
				if(chunkData[i].length > 3){
					chunkResult.push(chunkData[i].split(","));
				}
			}
			for(var i=0;i<chunkResult.length;i++){
				if(parseFloat(chunkResult[i][0]) > startTime){
					var curIndex = i-1;
					break;
				}
			}
			util.fastSend(chunk, chunkResult, curIndex, diff, startTime, socket); //chunk, chunkResult, curIndex, diff, oldTime, socket
		});
	});
}

util.liveBacktest = function(pair, startTime, server){
	var socket = ws.connect("ws://localhost:7507/");
	socket.on("error", function(err){
		console.log("Error in simulation injection socket: ");
		console.log(err);
	})

	var index = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/index.csv", {encoding: 'utf8'}, "r", function(err,data){
		var result = [];
		var indexData = data.split("\n");
		for(var i=1;i<indexData.length;i++){
			if(indexData[i].length > 3){
				result.push(indexData[i].split(","));
			}
		}
		for(var i=0;i<result.length;i++){
			if(parseFloat(result[i][2]) > startTime){
				var chunk = parseFloat(result[i][0]);
				break;
			}
		}
		var chunkFile = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/" + pair + "_" + chunk + ".csv", {encoding: "utf8"}, "r", function(err, data){
			var chunkResult = [];
			var chunkData = data.split("\n");
			for(var i=1;i<chunkData.length;i++){
				if(chunkData[i].length > 3){
					chunkResult.push(chunkData[i].split(","));
				}
			}
			for(var i=0;i<chunkResult.length;i++){
				if(parseFloat(chunkResult[i][0]) > startTime){
					var curIndex = i-1;
					break;
				}
			}
			util.liveSend(chunk, chunkResult, curIndex, 0, parseFloat(chunkResult[curIndex][0]), socket);
		});
	});
}

util.liveSend = function(chunk, chunkResult, curIndex, diff, oldTime, socket){ //TODO: Make it so that a simulation can be cancelled while it's going on.
	if(curIndex > chunkResult.length){
		curIndex = 1
		chunk++;
		var chunkResult = [];
		var chunkData = data.split("\n");
		var chunkFile = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/" + pair + "_" + chunk + ".csv", {encoding: "utf8"}, "r", function(err, data){
			for(var i=1;i<chunkData.length;i++){
				if(chunkData[i].length > 3){
					chunkResult.push(chunkData[i].split(","));
				}
			}
		});
		diff = parseFloat(chunkResult[1][0]) - oldTime;
	}else{
		diff = (parseFloat(chunkResult[curIndex+1][0]) - parseFloat(chunkResult[curIndex][0]))*1000;
		//console.log(parseFloat(chunkResult[curIndex+1][0]), parseFloat(chunkResult[curIndex][0]));
	}
	socket.sendText('{"type":"new_tick","data":{"timestamp":' + chunkResult[curIndex][0] + ',"ask":' + chunkResult[curIndex][1] + ',"bid":' + chunkResult[curIndex][2] + "}}", function(){
		//console.log("Data sent through websocket: " + chunkResult[curIndex][0] + "," + chunkResult[curIndex][1] + "," + chunkResult[curIndex][2]);
	});
	curIndex++;
	oldTime = chunkResult[curIndex][0];
	setTimeout(function(){util.liveSend(chunk, chunkResult, curIndex, diff, oldTime, socket)}, diff);
}

util.fastSend = function(chunk, chunkResult, curIndex, diff, oldTime, socket){ //TODO: Make it so that a simulation can be cancelled while it's going on.
	if(curIndex > chunkResult.length){
		curIndex = 1
		chunk++;
		var chunkResult = [];
		var chunkData = data.split("\n");
		var chunkFile = fs.readFile("/home/ubuntu/bot/tick_data/" + pair + "/" + pair + "_" + chunk + ".csv", {encoding: "utf8"}, "r", function(err, data){
			for(var i=1;i<chunkData.length;i++){
				if(chunkData[i].length > 3){
					chunkResult.push(chunkData[i].split(","));
				}
			}
		});
		//diff = parseFloat(chunkResult[1][0]) - oldTime;
	}else{
		//diff = (parseFloat(chunkResult[curIndex+1][0]) - parseFloat(chunkResult[curIndex][0]))*1000;
		//console.log(parseFloat(chunkResult[curIndex+1][0]), parseFloat(chunkResult[curIndex][0]));
	}
	socket.sendText('{"type":"new_tick","data":{"timestamp":' + chunkResult[curIndex][0] + ',"ask":' + chunkResult[curIndex][1] + ',"bid":' + chunkResult[curIndex][2] + "}}", function(){
		//console.log("Data sent through websocket: " + chunkResult[curIndex][0] + "," + chunkResult[curIndex][1] + "," + chunkResult[curIndex][2]);
	});
	curIndex++;
	oldTime = chunkResult[curIndex][0];
	setTimeout(function(){util.fastSend(chunk, chunkResult, curIndex, diff, oldTime, socket)}, diff);
}