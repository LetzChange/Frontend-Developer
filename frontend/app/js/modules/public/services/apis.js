'use strict';
module.exports = ['$rootScope',
    function($rootScope) {
        var baseURI = 'http://playlist-royletzchange.rhcloud.com/';
        return {
            'list': baseURI + 'list',
            'add': baseURI + 'add',
            'remove': baseURI + 'remove/',
            'fetchVideoInfo': 'https://www.googleapis.com/youtube/v3/videos?',
            'videoInfoConfigUrl': '&part=snippet,contentDetails,statistics,status'
        };
    }
];
