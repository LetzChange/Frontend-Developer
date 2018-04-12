const express = require('express');
const router = express.Router();
const Song = require('../models/song');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    res.status(200).json({
        status : 'OK',
        data : {
            list:
                {description:'get playlist',type:'GET'},

            add:
                {description:"post data",type:"POST",
                data:{data:{title:{type:"string",required:true},
                id:{type:"string",required:true,unique:true},
                duration:{type:"number",required:true}}}},

            remove:
                {url : 'remove:/id',
                description:"remove by id",
                type:"POST"}

            }
    });
});

router.get('/list', (req, res, next) => {
   
    Song.find()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
    });


router.post('/add', (req, res, next) => {
   
    const songs = new Song({
        _id: new mongoose.Types.ObjectId(),
       idd: req.body.idd,
        title: req.body.title,
        duration : req.body.duration
    });
    songs
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

    res.status(200).json({
        message : 'Song Added',
        details : songs
    });
});

router.post('/remove/:idd', (req, res, next) => {
    const idd=req.params.idd;
    Song.remove({idd: idd})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
    .catch(err => {
        console.log(err);
    });
});


module.exports = router;