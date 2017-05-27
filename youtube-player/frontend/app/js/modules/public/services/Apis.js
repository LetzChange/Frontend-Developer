'use strict';
module.exports = ['$rootScope',
    function($rootScope) {
        var baseURI = 'http://playlist-royletzchange.rhcloud.com/';
        return {
            'fetchList': baseURI + 'list',
            'addUrl': baseURI + 'add',
            'remove': baseURI + 'remove/',
            'fetchVideoInfoById': function(id, key) {
                return 'https://www.googleapis.com/youtube/v3/videos?' + 'id=' + id + '&key=' + key + '&part=snippet,contentDetails,statistics,status';
            }
        }
    }
];
