import React from 'react';
import { Button, Icon, Progress } from 'semantic-ui-react';
import { Styled } from 'direflow-component';
import styles from './style.scss';

function formatTime(milliseconds) {
    if (!milliseconds) return '00:00';
    let seconds = milliseconds / 1000;
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);
    let millisecs = milliseconds % 1000;
    seconds = seconds - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    let time = minutes + ':' + seconds;
    return time.substr(0, 5);
}



const INITIAL_STATE = {
    hovering: false,
    started: false,
    playing: false,
    videoLoaded: false,
    duration: 0,
    currentTime: 0,
}

export default class VideoPlayer extends React.Component {

    state = {
        ...INITIAL_STATE
    }
    componentDidMount = () => {
        if (this.props.autoPlay) {
            this.onPlayToggle();
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.src !== nextProps.src) {
            this.setState({ ...INITIAL_STATE });
        }
    }

    onLoadedData = () => {
        if (this.videoRef) {
            this.videoRef.ontimeupdate = () => {
                if (this.videoRef) {
                    this.setState({ currentTime: this.videoRef.currentTime * 1000 });
                }
            }
            this.videoRef.onended = () => {
                this.setState({ playing: false });
            }
            this.setState({ duration: this.videoRef.duration * 1000, videoLoaded: true })
            // If there's a thumbnail, then the video being loaded means it have to play immediately
            if (this.state.started) {
                this.videoRef.play();
            }
        }
    }

    onFullScreen = () => {
        if (this.videoRef.requestFullscreen) {
            this.videoRef.requestFullscreen();
        } else if (this.videoRef.mozRequestFullScreen) { /* Firefox */
            this.videoRef.mozRequestFullScreen();
        } else if (this.videoRef.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            this.videoRef.webkitRequestFullscreen();
        } else if (this.videoRef.msRequestFullscreen) { /* IE/Edge */
            this.videoRef.msRequestFullscreen();
        }
    }

    onPlayToggle = (e) => {
        if (e) {
            e.stopPropagation();
        }
        const playing = !this.state.playing
        this.setState({ playing, started: true });
        if (this.videoRef) {
            if (playing) {
                this.videoRef.play();
            } else {
                this.videoRef.pause();
            }
        }
    }

    onProgressClick = (e) => {
        const percent = (e.clientX - e.target.getBoundingClientRect().x) / e.target.parentNode.getBoundingClientRect().width;
        const { duration } = this.state;
        this.videoRef.currentTime = duration * percent / 1000;
        this.setState({ currentTime: duration * percent })

    }

    render() {
        const {
            src,
            thumbnail,
        } = this.props;
        const {
            started,
            duration,
            playing,
            videoLoaded,
            currentTime,
            hovering,
        } = this.state;
        return (
            <Styled styles={styles}>

                <div className="video-player"

                    onMouseEnter={() => this.setState({ hovering: true })}
                    onMouseLeave={() => this.setState({ hovering: false })}
                >
                    {!started && thumbnail && (
                        <img src={thumbnail} style={{ width: '100%' }} />
                    )}

                    <video
                        {...(this.props.videoProps || {})}
                        src={src}
                        ref={(ref) => {
                            this.videoRef = ref;
                            if (this.props.videoRef) {
                                this.props.videoRef(ref);
                            }
                        }}
                        style={{ width: '100%', minHeight: 150, zIndex: this.state.started || !thumbnail ? 1 : -1, display: this.state.started || !thumbnail ? 'block' : 'none' }}
                        playing={playing}
                        onClick={this.onPlayToggle}
                        onLoadedData={this.onLoadedData}
                    />

                    <div className="overlay-container" onClick={(e) => e.stopPropagation()}>
                        {!started && (duration || this.props.duration) ? (
                            <span className="video-duration">{formatTime(duration)}</span>
                        ) : null}
                        {started && videoLoaded && duration ? (
                            <span className="video-duration">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        ) : null}
                        {videoLoaded && hovering ? (
                            <Button circular icon="expand arrows alternate" className="video-fullscreen" onClick={this.onFullScreen} />
                            // <span className="video-fullscreen">{formatTime(this.state.currentTime)}/{formatTime(duration * 1000)}</span>
                        ) : null}
                        {src && (hovering || !started) ? (
                            <Icon
                                circular
                                className="play-icon"
                                size="large"
                                name={this.state.playing ? 'pause' : 'play'}
                                onClick={this.onPlayToggle}
                            />
                        ) : null}

                        {started ? (
                            <div className="progress-container">
                                <Progress
                                    className="progress"
                                    size={'tiny'}
                                    color="#ff5c5c"
                                    percent={(currentTime / duration) * 100}
                                    onClick={this.onProgressClick}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </Styled>
        )
    }
}