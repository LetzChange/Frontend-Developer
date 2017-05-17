'use strict';

function VideoController($scope, $state, Constant, HTTP, APIS, $rootScope) {
    $rootScope.loading = true;

    var vm = this;
    vm.videos = [];
    vm.defaultThumbnail = "resources/video_icon.png";
    vm.showForm = false;
    vm.youtubeUrlRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    vm.form = {
        'link': ''
    };
    var reqObj = {};
    vm.init = function() {
        $rootScope.loading = true;
        reqObj = {
            'url': APIS.list,
        }
        HTTP.apiRequest(reqObj).then(function(res) {
            console.log("succc", res);
            vm.videos = res.data.data;
            vm.videoID = vm.videos[0].id;
            vm.end = vm.videos[0].duration;
            $rootScope.loading = false;
        }, function(err) {
            console.log(err);
            vm.videos = [];
            $rootScope.loading = false;
        });

    };

    vm.changeVideo = function(index) {
        vm.videoID = vm.videos[index].id;
        vm.end = vm.videos[index].duration;
    }
    vm.deletVideo = function(index) {
        $rootScope.loading = true;
        reqObj = {
            'url': APIS.remove + vm.videos[index].id,
            'method': 'POST'
        };
        HTTP.apiRequest(reqObj).then(function(res) {
            console.log('deleted');
            $rootScope.loading = false;
            vm.init();
        }, function(err) {
            console.log(err);
            vm.init();
            $rootScope.loading = false;
        });

    };

    vm.key = 'AIzaSyBoyYcM5pm0rVoCcbEgO9qPqUz1Vqj_jCw';
    vm.getDuration = function(duration) {
        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }

        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }

        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        return duration;
    };

    vm.addLink = function() {
        $rootScope.loading = true;

        vm.id = vm.form.link.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
        HTTP.apiRequest({ 'url': APIS.fetchVideoInfo + 'id=' + vm.id + '&key=' + vm.key + APIS.videoInfoConfigUrl })
            .then(function(res) {
                    console.log(res);
                    vm.thumbnail = res.data.items[0].snippet.thumbnails.default.url;
                    reqObj = {
                        'url': APIS.add,
                        data: {
                            data: {
                                title: res.data.items[0].snippet.title,
                                id: vm.id,
                                duration: vm.getDuration(res.data.items[0].contentDetails.duration)
                            }
                        },
                        method: 'POST'
                    };

                    HTTP.apiRequest(reqObj)
                        .then(function(res) {
                            $rootScope.loading = false;
                            vm.showForm = !vm.showForm
                            vm.videos.push({
                                title: reqObj.data.data.title,
                                duration: reqObj.data.data.duration,
                                thumbnail: vm.thumbnail,
                                id: vm.id
                            });
                            if (vm.videos.length === 1) {
                                vm.changeVideo(0);
                            }
                        }, function(err) {
                            console.log(res);
                        });
                },
                function(err) {
                    console.log(res);
                });
    }


};

VideoController.$inject = ['$scope', '$state', 'Constant', 'HTTP', 'APIS', '$rootScope'];
module.exports = VideoController;
