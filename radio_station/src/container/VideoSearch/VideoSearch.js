import React,{Component} from 'react';
import ScrollArea from 'react-scrollbar';
import axios from 'axios';
class VideoSearch extends Component{
    constructor(props){
        super(props);
        this.state = { items: [], searchTerm:""};
        this.onSearchTermChange=this.onSearchTermChange.bind(this);
        this.displayResult=this.displayResult.bind(this);
    }
    displayResult(){
        var self=this;
        axios.get('https://www.googleapis.com/youtube/v3/search?key=AIzaSyDbl0wA3a5JJSkRFiFddjoce-rbf23tsUw&maxResults=25&part=snippet&q=' + this.state.searchTerm + '&type=video')
            .then(response => {
                console.log(response);
                debugger;
                self.setState({items:response.data.items.map(x=>{return {id:x.id.videoId, title:x.snippet.title}})})
            })
            .catch(error => console.log(error));
    }
    onSearchTermChange = function (event) {
        let searchTerm = event.target.value;
        this.setState({ searchTerm: searchTerm })
    }
    render(){
        var items=this.state.items.map(x=>(
            <div key={x.id} className="song amplitude-song-container amplitude-play-pause amplitude-paused amplitude-active-song-container" amplitude-song-index="0"
                data-song="audio/01-title-staff-roll.mp3" data-cover="images/album-art/1.jpg">
                <div className="song-meta-data">
                    <span className="song-title">{x.title}</span>
                </div>
                <div className="play-now">
                    <a className="btn btn-sm btn-black">
                        <span className="normal-state" onClick={()=>this.props.handleAddToList(x.id)}>Add to Playlist</span>
                    </a>
                </div>
            </div>
        ));
        return(
            <div class="scrollableDiv">
                <div className="player-track-list-block">
                    <div className="inputBox song amplitude-song-container amplitude-play-pause amplitude-paused amplitude-active-song-container" amplitude-song-index="0"
                        data-song="audio/01-title-staff-roll.mp3" data-cover="images/album-art/1.jpg">
                        <div className="song-meta-data">
                            <input type="text" value={this.state.searchTerm} onChange={this.onSearchTermChange} />
                        </div>
                        <div className="play-now">
                            <a className="btn btn-sm btn-black">
                                <span className="normal-state" onClick={this.displayResult}>Search</span>
                            </a>
                        </div>
                    </div>
                    {items}
               </div>    
            </div>
        );
    }
}
export default VideoSearch;