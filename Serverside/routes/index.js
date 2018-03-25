var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list/:content', function(req, res, next) {
  res.render('list', { title: 'GET', input: req.params.content });
});


router.get('/add/:id', function(req, res, next) {
  res.render('add', { title: 'ADD', input: req.params.id });
});

router.post('/add/submit', function(req, res, next){
    var id = req.body.id;
    res.redirect('/add/'+id);
});
router.get('/remove/:id', function(req, res, next) {
  res.render('remove', { title: 'REMOVE', input: req.params.id });
});

router.post('/remove/submit', function(req, res, next){
    var id = req.body.id;
    res.redirect('/remove/'+id);
});

module.exports = router;
