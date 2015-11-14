var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/monitor', function(req, res, next) {
	res.render('monitor', { title: 'Express' });
});

router.get('/', function(req, res, next){
	res.render('index');
})

module.exports = router;