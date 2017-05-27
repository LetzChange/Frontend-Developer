'use strict';

angular.module('youtubePlayer', [
    'ui.router',
    'ui.bootstrap',
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.buffering",
    "info.vietnamcode.nampnq.videogular.plugins.youtube",
    'ngAnimate',
    'toastr',
    require('./modules').name
])
