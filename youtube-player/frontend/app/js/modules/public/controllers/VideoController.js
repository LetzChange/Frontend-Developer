'use strict';

function VideoController($scope, $state, Constant, HTTP, APIS, $rootScope, $sce, $timeout, toastr) {
    $rootScope.loading = true;

    var vm = this;
    vm.API = null;
    vm.videoSrc = [];
    vm.youtubeUrlRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    vm.form = {
        'url': ''
    };
    vm.key = 'AIzaSyBoyYcM5pm0rVoCcbEgO9qPqUz1Vqj_jCw';
    vm.onPlayerReady = function(API) {
        vm.API = API;
    }
    vm.config = {
        preload: "none",
        sources: [
            { src: $sce.trustAsResourceUrl("") },
        ],
        tracks: [{
            src: "pale-blue-dot.vtt",
            kind: "subtitles",
            srclang: "en",
            label: "English",
            default: ""
        }],
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        }
    };
    vm.changeVideoSource = function(index) {
        vm.currentVideoSourceIndex = index;
        vm.API.stop();
        vm.config.sources = vm.videoSrc[index].sources;
        $timeout(vm.API.play.bind(vm.API), 100);
    }

    vm.onVideoComplete = function() {
        vm.videoSrc.splice(vm.currentVideoSourceIndex, 1);
        if (vm.videoSrc[vm.currentVideoSourceIndex + 1]) {
            return vm.changeVideoSource(vm.currentVideoSourceIndex + 1);
        } else if (vm.videoSrc[0]) {
            return vm.changeVideoSource(0);
        }
    }
    vm.init = function() {
        $rootScope.loading = true;
        HTTP.apiRequest({
            'url': APIS.fetchList,
        }).then(function(res) {
            vm.videoSrc = res.data.data.map(function(video) {
                console.log('https://www.youtube.com/watch?v=' + video.id);
                return {
                    title: video.title,
                    duration: video.duration,
                    thumbnail: video.thumbnail,
                    id: video.id,
                    sources: [{
                        src: $sce.trustAsResourceUrl('https://www.youtube.com/watch?v=' + video.id)
                    }]
                }
            });
            vm.changeVideoSource(0);
            $rootScope.loading = false;
            console.log('videoSrclength', vm.videoSrc);
        }, function(err) {
            console.log(err);
            vm.videoSrc = [];
            $rootScope.loading = false;
            toastr.info("No playlist found", "Error");
            console.log('videoSrclength', vm.videoSrc);
            if (!vm.videoSrc.length) {
                vm.API.stop();
            }
        });

    };

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
    vm.addToPlaylist = function() {
        $rootScope.loading = true;

        vm.id = vm.form.url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
        HTTP.apiRequest({ 'url': APIS.fetchVideoInfoById(vm.id, vm.key) })
            .then(function(res) {
                    console.log(res);
                    vm.thumbnail = res.data.items[0].snippet.thumbnails.default.url;
                    var req = {
                        'url': APIS.addUrl,
                        data: {
                            data: {
                                title: res.data.items[0].snippet.title,
                                id: vm.id,
                                duration: vm.getDuration(res.data.items[0].contentDetails.duration)
                            }
                        },
                        method: 'POST'
                    };

                    HTTP.apiRequest(req)
                        .then(function(res) {
                            $rootScope.loading = false;
                            vm.showForm = !vm.showForm
                            vm.videoSrc.push({
                                title: req.data.data.title,
                                duration: req.data.data.duration,
                                thumbnail: vm.thumbnail,
                                id: vm.id,
                                sources: [{
                                    src: $sce.trustAsResourceUrl('https://www.youtube.com/watch?v=' + vm.id)
                                }]
                            });

                            if (vm.videoSrc.length === 1) {
                                vm.changeVideoSource(0);
                            }
                            toastr.success("Playlist added successfully", "Success");
                            vm.form.url = "";

                        }, function(err) {
                            console.log(err);
                            $rootScope.loading = false;
                            toastr.error("Playlist add error", "Error");

                        });
                },
                function(err) {
                    $rootScope.loading = false;

                    console.log(err);
                    toastr.error("Something went wrong", "Error");
                });
    }
    vm.removeVideo = function(index) {
        $rootScope.loading = true;

        HTTP.apiRequest({
            'url': APIS.remove + vm.videoSrc[index].id,
            'method': 'POST'
        }).then(function(res) {
            $rootScope.loading = false;
            toastr.success("Playlist removed successfully", "Success");

            vm.init();

        }, function(err) {
            console.log(err);
            vm.init();
            $rootScope.loading = false;
            toastr.error("Something went wrong", "Error");

        });

    };
};

VideoController.$inject = ['$scope', '$state', 'Constant', 'HTTP', 'APIS', '$rootScope', '$sce', '$timeout', 'toastr'];
module.exports = VideoController;
