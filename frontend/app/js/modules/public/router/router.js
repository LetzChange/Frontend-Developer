'use strict';
module.exports = [
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                template: require('../templates/video.html'),
                controller: 'VideoController',
                controllerAs: 'vm'
            })
        $urlRouterProvider.otherwise('/home');
    }
];
