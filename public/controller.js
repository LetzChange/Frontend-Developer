var controller = angular.module('radioApp', ['ngYoutubeEmbed']);

function mainController($scope, $http, $location){
    $scope.currentPlaylist=[];
    // youtube player api
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an iframe and YouTube player
// after the API code downloads.
            var ik_player;
            $scope.onYouTubeIframeAPIReady=function(id){
               window.localStorage.setItem('videoId', id);
               window.location.reload();
            }
            window.onYouTubeIframeAPIReady=function(videoId){
                if (window.localStorage.getItem('videoId')) {
                    var id = window.localStorage.getItem('videoId');
                }
                else{
                    id = $scope.currentPlaylist[0].id; 
                }
                player = new YT.Player('ik_player', {
                height: '390',
                width: '640',
                videoId: id,
                events: {
                      'onReady': onPlayerReady,
                      'onStateChange': onPlayerStateChange,
                    }
                });
            }
            function onPlayerReady(event) {
                console.log('player is ready');
            }   

// The API calls this function when the player's state changes.
            function onPlayerStateChange(event) {
                  switch (event.data) {
                        
                        case YT.PlayerState.ENDED:
                        if (window.localStorage.getItem('videoId')) {
                            var id = window.localStorage.getItem('videoId');
                        }
                        else{
                            id = $scope.currentPlaylist[0].id; 
                        }
                        var itemId = {
                            id : id    
                        } 
                          $http.post("http://localhost:3000/removePlaylistItem", itemId)
                          .success(function(data){
                            //console.log(data)
                             $scope.currentPlaylist =   data;
                             window.localStorage.removeItem("videoId");
                             window.location.reload();
                            })
                          .error(function(err){
                                console.log(err);
                            })
                          break;
                    }
            }
    
    function durationToSeconds(duration) {
        var Numbers = duration.match(/^PT(\d+H)?(\d+M)?(\d+S)?/);
        var hours = (parseInt(Numbers[1]) || 0);
        var minutes = (parseInt(Numbers[2]) || 0);
        var seconds = (parseInt(Numbers[3]) || 0);
        return hours*360 + minutes*60 + seconds;
    }
    
    $http.get("http://localhost:3000/playlist")
    .success(function(data){
        $scope.currentPlaylist =   data;
    })
    .error(function(err){
        $scope.currentPlaylist = err;
    });
    
    $scope.youtubeData = function(){
        if($scope.url){
            var URL = $scope.url
            var validate = URL.match(/^(http(s)?:\/\/)?((w){3}.)?youtube(\.com)?\/watch\?v\=([^?]+)/i) || URL.match(/^(http(s)?:\/\/)?((w){3}.)?youtu\.be\/([^?]+)/i);
            if (validate) {
                var videoId = validate[6];
            }
            $http.get("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA_ejoxjEoSORdsubSOprvXG3Qoq6zmcMM&part=snippet,contentDetails&id="+videoId)
            .success(function(videoDetails){
                var requiredVideoDetails = {
                    id : videoDetails.items["0"].id,
                    title : videoDetails.items["0"].snippet.title,
                    thumbnail : videoDetails.items["0"].snippet.thumbnails.default.url,
                    duration : durationToSeconds(videoDetails.items["0"].contentDetails.duration)
                }
                $http.post("http://localhost:3000/addPlaylistItem", requiredVideoDetails)
                .success(function(data){
                    if (data) {
                        $scope.currentPlaylist = data;
                    }
                    
                    window.location.reload();
                })
                .error(function(err){
                    console.log(err);
                });
            })
            .error(function(err){
                console.log(err);            
            });
        }
    };
}