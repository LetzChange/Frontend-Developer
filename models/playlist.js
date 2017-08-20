var mongoose= require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String     
    },
    duration : {
        type : String,
        required : true
    }
});

var Playlist = mongoose.model('playlist', playlistSchema);

module.exports = Playlist;