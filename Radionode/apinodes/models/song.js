const mongoose = require('mongoose');

const songsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    idd: String,
    title: String,
    duration : String
});

module.exports = mongoose.model('Song', songsSchema);