import React from 'react';
import YouTube from 'react-youtube';
const Player = props => (
    <div id="player-one" className="player-main-block">
        <div className="album-art-block">
            <div className="track-meta-info" id="meta-container">
                {props.songInfo && <span className="song-name" amplitude-song-info="name" amplitude-main-song-info="true">{props.songInfo.title}</span>}
                <div className="song-artist-album">
                    
                </div>
            </div>
            <div className="album-art-space">
                
                
                    {/* <iframe className="player" type="text/html" width="100%" height="100%"
                        src={"https://www.youtube.com/embed/" +
                            props.songInfo.id + "?autoplay=" +
                            props.autoplay + "&rel=" +
                            props.rel + "&modestbranding=" +
                            props.modest+"&controls="+
                            props.controls}
                        frameborder="0" /> */}

                {props.songInfo && <YouTube
                    videoId={props.songInfo.id}                  // defaults -> null
                    // id={string}                       // defaults -> null
                    // className={string}                // defaults -> null
                    opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: { 
                            autoplay: props.autoplay,
                            rel :props.rel,
                            modestbranding:props.modest,
                            controls:1
                        }
                    }}                        // defaults -> {}
                    // onReady={func}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    onEnd={function(){props.onVideoEnd()}}                      // defaults -> noop
                    // onError={func}                    // defaults -> noop
                    // onStateChange={func}              // defaults -> noop
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
                />
                }

            </div>
        </div>
        <div id="amplitude-left" className="audio-controller-wrap">
            <div id="player-left-bottom">

                <div className="time-controller-block" id="time-container">
                    <div className="input-range-block">
                        <span className="current-time">
                            <span className="amplitude-current-minutes" amplitude-main-current-minutes="true">00</span>:
                                <span className="amplitude-current-seconds" amplitude-main-current-seconds="true">00</span>
                        </span>
                        <div className="track-progress-wrap">
                            <input type="range" className="amplitude-song-slider full-width" min="1" max="100" step="1" amplitude-main-song-slider="true" />
                            <div className="track-progress"></div>
                        </div>
                        <span className="duration">
                            <span className="amplitude-duration-minutes" amplitude-main-duration-minutes="true">03</span>:
                                <span className="amplitude-duration-seconds" amplitude-main-duration-seconds="true">18</span>
                        </span>
                    </div>
                </div>
                {/* <div id="control-container" className="control-container">
                    <div id="central-control-container">
                        <div id="central-controls" className="audio-controller-block">
                            <div className="controller-common amplitude-prev" id="previous"></div>
                            <div className="controller-common amplitude-play-pause play-pause-btn amplitude-paused" amplitude-main-play-pause="true" id="play-pause"></div>
                            <div className="controller-common amplitude-next" id="next"></div>
                        </div>
                    </div>
                </div> */}
                <div className="player-footer">
                    <div className="volume-container">
                        <i className="fa fa-volume-down" aria-hidden="true"></i>
                        <input type="range" className="amplitude-volume-slider volume-slider-one" />
                        <i className="fa fa-volume-up" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Player;