var express= require('express');
var app = express();
var mongoose = require('mongoose');
//var morgon = require('morgon');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/radioApp');
var db = mongoose.connection;
db.on('error', function(err){console.log(err);});
db.once('open', function(){console.log('connected to database');});

var router = express.Router();
router.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

var fetchPlaylist = require('./routes/playlist.js');
var addPlaylistItem = require('./routes/addPlaylistItem.js');
var removePlaylistItem = require('./routes/removePlaylistItem.js');
var Playlist = require('./models/playlist');

app.use('/playlist', fetchPlaylist);
app.use('/addPlaylistItem', addPlaylistItem);
app.use('/removePlaylistItem', removePlaylistItem);

app.get('/',function(req,res){
        res.sendfile('./public/index.html');
    });

app.listen(3000);