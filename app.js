var app = angular.module('LetzChangeRadioApp', []);

app.run(function () {
  var tag = document.createElement('script');
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

app.config( function ($httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


app.service('YoutubeVideosService', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

  var service = this;

  var youtube = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '480',
    playerWidth: '640',
    state: 'Now stopped'
  };
  var searchResults = [];
  var AddedPlaylist = [
    {id: '5dmQ3QWpy1Q', title: 'Heavy (Official Video) - Linkin Park (feat. Kiiara)'},
    {id: 'jtatzJRPNZE', title: 'Justin Bieber - Despacito (Lyrics) ft. Luis Fonsi, Daddy Yankee'},
    {id: 'fdubeMFwuGs', title: 'Ilahi Yeh Jawaani Hai Deewani Full Video Song | Ranbir Kapoor, Deepika Padukone'},
    {id: 'npao6yCXcGs', title: 'Safar - Full Song Video | Anushka | Shah Rukh | Pritam | Arijit Singh'},
    {id: 'D7ab595h0AU', title: 'Battle Symphony (Official Lyric Video) - Linkin Park'},
 
  ];
  var history = [
    {id: 'D7ab595h0AU', title: 'Battle Symphony (Official Lyric Video) - Linkin Park'}
  ];

  $window.onYouTubeIframeAPIReady = function () {
    $log.info('Youtube API is ready');
    youtube.ready = true;
    service.bindPlayer('placeholder');
    service.loadPlayer();
    $rootScope.$apply();
  };

  function onYoutubeReady (event) {
    $log.info('YouTube Player is ready');
    youtube.player.cueVideoById(history[0].id);
    youtube.videoId = history[0].id;
    youtube.videoTitle = history[0].title;
  }

  function onYoutubeStateChange (event) {
    if (event.data == YT.PlayerState.PLAYING) {
      youtube.state = ' Now playing';
    } else if (event.data == YT.PlayerState.PAUSED) {
      youtube.state = 'Now paused';
    } else if (event.data == YT.PlayerState.ENDED) {
      youtube.state = 'Now ended';
      service.displayPlayer(AddedPlaylist[0].id, AddedPlaylist[0].title);
     
      service.deleteVideo(AddedPlaylist, AddedPlaylist[0].id);
    }
    $rootScope.$apply();
  }

  this.bindPlayer = function (elementId) {
    $log.info('Binding to ' + elementId);
    youtube.playerId = elementId;
  };

  this.createPlayer = function () {
    $log.info('Creating a new Youtube player for DOM id ' + youtube.playerId + ' and video ' + youtube.videoId);
    return new YT.Player(youtube.playerId, {
      height: youtube.playerHeight,
      width: youtube.playerWidth,
      playerVars: {
        rel: 0,
        showinfo: 0
      },
      events: {
        'onReady': onYoutubeReady,
        'onStateChange': onYoutubeStateChange
      }
    });
  };

  this.loadPlayer = function () {
    if (youtube.ready && youtube.playerId) {
      if (youtube.player) {
        youtube.player.destroy();
      }
      youtube.player = service.createPlayer();
    }
  };

  this.displayPlayer = function (id, title) {
    youtube.player.loadVideoById(id);
    youtube.videoId = id;
    youtube.videoTitle = title;
    return youtube;
  }

  this.listsearchResults = function (data) {
    searchResults.length = 0;
    for (var i = data.items.length - 1; i >= 0; i--) {
      searchResults.push({
        id: data.items[i].id.videoId,
        title: data.items[i].snippet.title,
        description: data.items[i].snippet.description,
        thumbnail: data.items[i].snippet.thumbnails.default.url,
        author: data.items[i].snippet.channelTitle
      });
    }
    return searchsearchResults;
  }

  this.queueVideo = function (id, title) {
    AddedPlaylist.push({
      id: id,
      title: title
    });
    return AddedPlaylist;
  };

 

  this.deleteVideo = function (list, id) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].id === id) {
        list.splice(i, 1);
        break;
      }
    }
  };

  this.getYoutube = function () {
    return youtube;
  };

  this.getsearchResults = function () {
    return searchResults;
  };

  this.getAddedPlaylist = function () {
    return AddedPlaylist;
  };

  this.getHistory = function () {
    return history;
  };

}]);

app.controller('YoutubeVideosController', function ($scope, $http, $log, YoutubeVideosService) {

    init();

    function init() {
      $scope.youtube = YoutubeVideosService.getYoutube();
      $scope.searchResults = YoutubeVideosService.getsearchResults();
      $scope.AddedPlaylist = YoutubeVideosService.getAddedPlaylist();
      $scope.history = YoutubeVideosService.getHistory();
      $scope.playlist = true;
    }

    $scope.display = function (id, title) {
      YoutubeVideosService.displayPlayer(id, title);
     $log.info('displayed id:' + id + ' and title:' + title);
    };

    $scope.queue = function (id, title) {
      YoutubeVideosService.queueVideo(id, title);
      YoutubeVideosService.deleteVideo($scope.history, id);
      $log.info('Queued id:' + id + ' and title:' + title);
    };

    $scope.delete = function (list, id) {
      YoutubeVideosService.deleteVideo($scope.AddedPlaylist, id);
    };

    $scope.search = function () {
      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyC9BwiUHH6ErokevcBYu1be7YEJ8Dqybfg',
          type: 'video',
          maxsearchResults: '12',
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
          q: this.query
        }
      })
      .success( function (data) {
        YoutubeVideosService.listsearchResults(data);
        $log.info(data);
      })
      .error( function () {
        $log.info('Search error');
      });
    }

    $scope.tabulate = function (state) {
      $scope.playlist = state;
    }
});
