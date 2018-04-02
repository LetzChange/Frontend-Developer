import React, { Component } from 'react';
import axios from 'axios';
import Player from './container/player/player'
import VideoSearch from './container/VideoSearch/VideoSearch'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      url: "",
      valid: false
    }
    this.onAddClick = this.onAddClick.bind(this);
    this.onURLChange = this.onURLChange.bind(this); 
    this.handleOnVideoEnd = this.handleOnVideoEnd.bind(this);
    this.onAddToListFromSearch = this.onAddToListFromSearch.bind(this);
  }

  onURLChange = function (event) {
    let url = event.target.value;
    this.setState({ url: url })
    if (this.validateURL(url)) this.setState({ valid: true })
    else this.setState({ valid: false })
  }
  onAddClick() {
    let url = this.state.url;
    let validID = this.validateURL(url);
    if (!validID) {

    }
    else {
      let meta = this.getMetaData(validID);
    }
  }
  validateURL(url) {
    if (url != undefined || url != '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return match[2];
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        // $('#ytplayerSide').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=0');
      }
      else {
        // Do anything for not being valid
        return false;
      }
    }

  }
  durationToSeconds(duration) {
    let Numbers = duration.match(/^PT(\d+H)?(\d+M)?(\d+S)?/);
    let hours = (parseInt(Numbers[1]) || 0);
    let minutes = (parseInt(Numbers[2]) || 0);
    let seconds = (parseInt(Numbers[3]) || 0);
    return hours * 360 + minutes * 60 + seconds;
  }
  addToPlaylist(videoDetails) {
    var self=this;
    var data = {
      'id': videoDetails.items["0"].id,
      'title': videoDetails.items["0"].snippet.title,
      'duration': this.durationToSeconds(videoDetails.items["0"].contentDetails.duration)
    };
    axios({ method: "post", url: "https://cors-anywhere.herokuapp.com/https://letzchange.org/api/playlist/add", data: { data: data } }).then(response =>
      response).then(response =>{
        console.log("[add]:", response)
        self.setState({playlist:[...this.state.playlist,data]});
      }).catch(error => {
        console.log(error);
      });
    this.setState({ url: "", valid: false });
  }
  getMetaData(id) {
    axios.get("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDbl0wA3a5JJSkRFiFddjoce-rbf23tsUw&part=snippet,contentDetails&id=" + id).then(
      data => {
        console.log('[meta]', data);
        this.addToPlaylist(data.data);
      }).catch(
        err =>
          console.log(err)
      )
  }
  removeSongFromPlaylist() {
    axios({ method: "post", url: "https://cors-anywhere.herokuapp.com/https://letzchange.org/api/playlist/remove/"+this.state.playlist[0].id})
    .then(response =>{
        this.setState({
          playlist:this.state.playlist.slice(1,this.state.playlist.length)
        })
    })
    .catch(error=>{

    })
  }
  handleOnVideoEnd(){

    this.removeSongFromPlaylist();
  }
  getPlayList() {
    var self = this;
    axios.get("https://letzchange.org/api/playlist/list").then(response => response).
      then(data =>{
        self.setState({ playlist: data.data.data })
        console.log(data)
      }).catch(error => {
        console.log('er', error)
        self.setState({ playlist: [] })
      });
  }
  componentDidMount() {
    var self=this;
    window.setInterval(function(){
      self.getPlayList();
    },2000)
  }

  onAddToListFromSearch(id){
    this.getMetaData(id) 
  }
  render() {
    let songs = this.state.playlist.map((x,index) => (
      (!index==0)&&(<div className="song amplitude-song-container amplitude-play-pause amplitude-paused amplitude-active-song-container" amplitude-song-index="0"
        data-song="audio/01-title-staff-roll.mp3" data-cover="images/album-art/1.jpg">
        <div className="song-meta-data">
          <span className="song-title">{x.title}</span>
        </div>
      </div>)
    ))
    return (
      <div className="App">
        <div className="section tracks-section text-white">
          <div className="overlay section-padding">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-md-offset-2 col-xs-12">
                  <div className="section-header text-center">
                    <h3 className="section-title">Tracklist</h3>
                    <p className="section-subtext">we trying hard to make your fresh mind we trying hard to make your fresh mind</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className="music-wrap">
                    <div className="row">

                      <div className="col-md-4 col-sm-5 col-xs-6">
                        <VideoSearch handleAddToList={this.onAddToListFromSearch} />
                      </div>

                      <div className="col-md-4 col-sm-5 col-xs-6">
                         <Player onVideoEnd={this.handleOnVideoEnd} controls="0" autoplay="1" rel="0" modest="1" songInfo={this.state.playlist[0]}/>
                      </div>
                      <div className="col-md-4 col-sm-5 col-xs-6">
                        <div className="scrollableDiv">
                          <div className="player-track-list-block">
                            <div className="inputBox song amplitude-song-container amplitude-play-pause amplitude-paused amplitude-active-song-container" amplitude-song-index="0"
                              data-song="audio/01-title-staff-roll.mp3" data-cover="images/album-art/1.jpg">
                              <div className="song-meta-data">
                                <input type="text" onChange={this.onURLChange} />
                              </div>
                              <div className="play-now">
                                <a className="btn btn-sm btn-black">
                                  <span className="normal-state" onClick={this.onAddClick}>Add to Playlist</span>
                                </a>
                              </div>
                            </div>
                            {songs}
                          </div>
                          {/* <div className="slimScrollBar" ></div>
                          <div className="slimScrollRail" ></div> */}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
