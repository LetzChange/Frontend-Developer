'use strict';

module.exports = angular.module('RadioApp.modules.public', ['ui.router'])
    .config(require('./router/router'))
    .constant('Constant', require('./config/constant'))
    .service('HTTP', require('./services/HTTP'))
    .service('APIS', require('./services/apis'))
    .controller('VideoController', require('./controllers/VideoController'))
