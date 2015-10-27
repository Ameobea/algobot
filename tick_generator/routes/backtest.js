var express = require('express');
var router = express.Router();

var util = require("../helpers/util");

//TODO: Check if a simulation is currently running before trying to start another.
router.get('/fast/:pair/:start/:speed', function(req, res, next){
	res.send(util.fastBacktest(req.params.pair, req.params.start, req.params.speed));
});

router.get("/live/:pair/:start", function(req, res, next){
	res.send(util.liveBacktest(req.params.pair, req.params.start));
});

module.exports = router;