const express = require('express');
const app=express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//mongoose.connect('mongodb://admin:admin123@radio-shard-00-00-jzjem.mongodb.net:27017,radio-shard-00-01-jzjem.mongodb.net:27017,radio-shard-00-02-jzjem.mongodb.net:27017/test?ssl=true&replicaSet=Radio-shard-0&authSource=admin')
mongoose.connect('mongodb://admin:admin123@radio-shard-00-00-jzjem.mongodb.net:27017,radio-shard-00-01-jzjem.mongodb.net:27017,radio-shard-00-02-jzjem.mongodb.net:27017/test?ssl=true&replicaSet=Radio-shard-0&authSource=admin', function(err) {
    // If no error, successfully connected
    console.log(err);
  });
const songsRouter = require('./apinodes/routes/songs');

app.use('/songs', songsRouter);

app.use((req, res, next) => {
    const error = new Error('URL NOT FOUND');
    error.status = 404 ;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;