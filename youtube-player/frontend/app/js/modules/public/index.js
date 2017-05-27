'use strict';

module.exports = angular.module('youtubePlayer.modules.public', ['ui.router'])
    .config(require('./router/router'))
    .constant('Constant', require('./config/constant'))
    .service('HTTP', require('./services/Http'))
    .service('APIS', require('./services/Apis'))
    .controller('VideoController', require('./controllers/VideoController'))
