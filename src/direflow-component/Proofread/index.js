import React from 'react';
import { connect } from 'react-redux';
import { Progress, Grid, Dropdown, Button, Icon, Modal, Input, Popup } from 'semantic-ui-react';
import Lottie from 'react-lottie';
import Switch from 'react-switch';

import * as actions from './modules/actions';
import ProgressBoxes from './components/ProgressBoxes';
import VideoTimeline from './components/VideoTimeline/v2';
import SubtitleForm from './components/SubtitleForm';
import successLottie from './lottie/success.json';
import loadingLottie from './lottie/loading.json';
import ProofreadingVideoPlayer from './components/ProofreadingVideoPlayer';
import SplitterIcon from './components/SplitterIcon';
import SpeakerDragItem from './components/SpeakerDragItem';
import SubtitleNameForm from './components/SubtitleNameForm';
import { formatTime, getUserOrganziationRole } from './utils/helpers';

import styles from './style.scss';

import FindAndReplaceModal from './components/FindAndReplaceModal';

import { Styled } from 'direflow-component';

class Proofread extends React.Component {

    state = {
        stages: [],
        videoPlaying: false,
        controlsVisible: false,
        duration: 0,
        intervalId: null,
        currentTime: 0,
        subtitles: [],
        selectedSubtitle: null,
        splitterDragging: false,
        selectedSubtitleIndex: null,
        isConfirmConvertModalVisible: false,
        isConfirmDoneModalVisible: false,
        isFindAndReplaceModalVisible: false,
    }


    componentWillMount() {
        this.props.resetArticleState();
        this.props.resetState();
        this.startPoller();
        this.props.fetchUserData()
        this.props.fetchOrganizationData(this.props.apiKey)
        this.props.fetchArticleByVideoId(this.props.videoId);
        this.props.setToEnglish(false);
    }

    componentWillUnmount() {
        this.stopPoller();
        if (this.videoRef) {
            this.videoRef.ontimeupdate = null;
            this.videoRef.onended = null;
        }
        this.props.resetState();
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.activeStageIndex !== nextProps.activeStageIndex) {
            const { video, activeStageIndex } = nextProps;
            // this.onConvertVideo()
            if (activeStageIndex === 1) {

                this.props.fetchArticleByVideoId(video._id);
                this.stopPoller();
            } else if (activeStageIndex === 2) {
                this.startPoller();
            }
            if (video) {
                switch (video.status) {
                    case 'failed':
                        this.onVideoFailed(video); break;
                    case 'done':
                        this.onVideoDone(video); break;
                    default:
                        break;
                }
            }
        }
        if (this.props.fetchArticleState === 'loading' && nextProps.fetchArticleState === 'done' && nextProps.article) {
            const { slides } = nextProps.article;
            this.props.setSlidesToSubtitles(slides);
        }
    }

    onTimeChange = (currentTime) => {
        this.videoRef.currentTime = currentTime / 1000;
        this.setState({ currentTime });
        this.checkSelectedSubtitleChange(currentTime)
    }

    checkSelectedSubtitleChange = (currentTime) => {

        if (this.props.selectedSubtitle && this.props.selectedSubtitle.subtitle && (this.props.selectedSubtitle.subtitle.startTime <= currentTime && this.props.selectedSubtitle.subtitle.endTime >= currentTime)) {
            // same subtitle item;
            return;
        }

        const currentSubtitleIndex = this.props.subtitles.findIndex((s) => s.startTime <= currentTime && s.endTime >= currentTime);
        const currentSubtitle = this.props.subtitles[currentSubtitleIndex];
        if (currentSubtitle) {
            this.props.setSelectedSubtitle(currentSubtitle, currentSubtitleIndex);
        }
    }

    onSubtitleChange = (subtitle, subtitleIndex, changes) => {
        // this.props.onSaveSubtitle(subtitle, index)
        // this.props.setSubtitles(subtitles);
        const { slidePosition, subslidePosition } = subtitle;
        this.props.updateSubslide(slidePosition, subslidePosition, subtitle);
    }

    onVideoLoad = (e) => {
        if (this.videoRef) {
            this.videoRef.ontimeupdate = () => {
                this.setState({ currentTime: this.videoRef.currentTime * 1000 });
                this.checkSelectedSubtitleChange(this.videoRef.currentTime * 1000);
            }
            this.videoRef.onended = () => {
                this.setState({ videoPlaying: false });
            }
            this.setState({ duration: this.videoRef.duration * 1000 })
        }
    }

    startPoller = () => {
        // const videoId = '5d1d9b007e2a29705e0f2f11'
        this.props.fetchVideoById(this.props.videoId);
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
        const intervalId = setInterval(() => {
            this.props.fetchVideoById(this.props.videoId);
        }, 10000);
        this.setState({ intervalId });
    }

    stopPoller = () => {
        clearInterval(this.state.intervalId);
    }

    onVideoFailed(video) {
        this.stopPoller()
    }

    onVideoDone(video) {
        this.stopPoller();
        setTimeout(() => {
            console.log('Navigating to article')
            if (this.props.article) {
                // this.props.history.push(`/organization/article/${this.props.article._id}`)
            }
        }, 2500);
    }

    onSaveSubtitle = (subtitle, subtitleIndex, changes) => {
        const { slidePosition, subslidePosition } = subtitle;
        this.props.updateSubslide(slidePosition, subslidePosition, changes);
    }

    onAddSubtitle = (subtitle) => {
        this.props.addSubslide(subtitle);
    }

    onSubslideDelete = (subtitle, subtitleIndex) => {
        const { slidePosition, subslidePosition } = subtitle;
        this.props.onDeleteSubslide(slidePosition, subslidePosition);
    }

    onSubtitleSplit = (subtitle, wordIndex) => {
        const { slidePosition, subslidePosition } = subtitle;
        this.props.onSplitSubslide(slidePosition, subslidePosition, wordIndex, this.state.currentTime / 1000)
    }

    onSpeakerGenderChange = (speaker, gender) => {
        const speakers = this.props.article.speakersProfile;
        const speakerIndex = speakers.findIndex((s) => s.speakerNumber === speaker.speakerNumber);
        speakers[speakerIndex].speakerGender = gender;

        this.props.onSpeakersChange(speakers);
    }

    onAddSpeaker = () => {
        const { speakersProfile } = this.props.article;
        const newSpeakers = speakersProfile.slice();
        newSpeakers.push({ speakerNumber: speakersProfile.length + 1, speakerGender: 'male' });
        this.props.onSpeakersChange(newSpeakers);
    }

    onDeleteSpeaker = (index) => {
        const { speakersProfile } = this.props.article;
        const newSpeakers = speakersProfile.slice();
        newSpeakers.splice(index, 1)
        this.props.onSpeakersChange(newSpeakers);
    }

    onPlayToggle = () => {
        this.setState(({ videoPlaying }) => {
            const newPlaying = !videoPlaying;
            if (newPlaying) {
                this.videoRef.play();
            } else {
                this.videoRef.pause();
            }

            return { videoPlaying: newPlaying };
        })
    }

    canSaveAndComplete = () => {
        const { article, user, video, organization } = this.props;
        const userRole = getUserOrganziationRole(user, organization);
        // if the user is a verifier and is marked as reviewCompleted
        //  or if the user is admin or organization owner
        if (!article || !user || !video) return false;
        if ((video.verifiers.map(v => v._id).indexOf(user._id) !== -1 && article.reviewCompleted) ||
            (userRole && (userRole.permissions.indexOf('admin') !== -1 || userRole.organizationOwner))
        ) {
            return true;
        }
        // if there's no verifiers and user is a reviewer
        if (video.verifiers.length === 0 && video.reviewers.find(u => u._id === user._id)) {
            return true;
        }
        if ((!video.reviewers || video.reviewers.length === 0) && userRole && userRole.permissions.indexOf('review') !== -1) return true;
        return false;
    }

    canMarkAsDone = () => {
        const { article, user, video } = this.props;
        if (!article || !user || !video) return false;
        const userRole = getUserOrganziationRole(user);
        // if not marked as completed and user is a reviewer
        if (!article.reviewCompleted && video.reviewers.find(u => u._id === user._id)) {
            return true;
        }
        return false;
    }

    getVideoStatus = () => {
        if (this.props.video && this.props.video.status) return this.props.video.status;
        return null;
    }

    getProgress = () => {
        return parseInt(this.props.stages.filter(stage => stage.completed).length / this.props.stages.length * 100);
    }

    renderProgress = () => {
        return (
            <div style={{ backgroundColor: '#424650', padding: '2rem', width: '100%' }}>
                {this.getVideoStatus() !== 'failed' && this.props.stages ? (
                    <React.Fragment>
                        <ProgressBoxes stages={this.props.stages} />
                        <div style={{ width: '90%', margin: '2rem auto' }}>
                            <Progress indicating progress percent={this.getProgress()} />
                        </div>
                    </React.Fragment>
                ) : (
                        <div>
                            Something went wrong while converting the video, please try again.
                        </div>
                    )
                }
            </div>
        );
    }

    onConvertVideo = () => {
        this.setState({ isConfirmConvertModalVisible: false });
        this.props.convertVideoToArticle(this.props.finishRedirectRoute, this.props.video._id, this.props.article._id, this.props.toEnglish)
    }

    onMarkVideoAsDone = () => {
        this.setState({ isConfirmDoneModalVisible: false });
        this.props.markVideoAsDone(this.props.video._id, this.props.article._id)
    }

    renderConvertConfirmModal = () => {
        return (
            <Modal open={this.state.isConfirmConvertModalVisible} onClose={() => this.setState({ isConfirmConvertModalVisible: false })} size="tiny">
                <Modal.Header>
                    Convert video
                </Modal.Header>
                <Modal.Content>
                    Are you sure you're done verifying the review?
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({ isConfirmConvertModalVisible: false })} >Cancel</Button>
                    <Button color="blue" onClick={() => this.onConvertVideo()} >Yes</Button>
                </Modal.Actions>
            </Modal>
        )
    }

    renderDoneConfirmModal = () => {
        return (
            <Modal open={this.state.isConfirmDoneModalVisible} onClose={() => this.setState({ isConfirmDoneModalVisible: false })} size="tiny">
                <Modal.Header>
                    Mark Video as Done
                </Modal.Header>
                <Modal.Content>
                    Are you sure you're done proofreading?
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({ isConfirmDoneModalVisible: false })} >Cancel</Button>
                    <Button color="blue" onClick={() => this.onMarkVideoAsDone()} >Yes</Button>
                </Modal.Actions>
            </Modal>
        )
    }

    renderInstructions = () => {
        return (
            <div
                style={{ padding: '2rem' }}
            >
                <h2>Instructions:</h2>
                <ol style={{ fontSize: 20 }}>
                    {['Proofread the transcribed text', 'Review \'who spoke when\'', 'Press on "Save and Convert"'].map((s) => (
                        <li style={{ paddingBottom: 40 }} key={'step' + s} >{s}</li>
                    ))}
                </ol>
            </div>
        );
    }

    renderSpeakersProfiles = () => (
        <Grid.Row>
            <Grid.Column width={16}>
                {this.props.article && (
                    <div style={{ width: '100%', padding: '2rem', color: 'white' }}>
                        <h3>Speakers Profiles: </h3>
                        <Grid>
                            {this.props.article.speakersProfile.sort((a, b) => a.speakerNumber - b.speakerNumber).map((speaker, index) => (
                                <Grid.Row style={{ listStyle: 'none', padding: 10 }} key={'speakers' + index}>
                                    <Grid.Column width={3}>
                                        <span>Speaker {speaker.speakerNumber}</span>
                                    </Grid.Column>
                                    <Grid.Column width={3}>
                                        <Dropdown
                                            value={speaker.speakerGender}
                                            options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                                            onChange={(e, { value }) => this.onSpeakerGenderChange(speaker, value)}
                                        />
                                    </Grid.Column>


                                    <Grid.Column width={2}>
                                        {index === this.props.article.speakersProfile.length - 1 && (
                                            <Button color="red" onClick={() => this.onDeleteSpeaker(index)} icon="trash" size="tiny" />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            ))}
                            <Grid.Row>
                                <Grid.Column style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Button color="blue" onClick={this.onAddSpeaker} >Add Speaker</Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                )}
            </Grid.Column>
        </Grid.Row>
    )

    renderSpeakersDragAndDrop = () => (
        <Grid.Row style={{ display: 'flex', alignItems: 'flex-start', padding: 0 }}>
            <Grid.Column width={16} style={{ color: 'white' }}>
                <Grid>
                    <Grid.Row style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid.Column width={6}>
                            <span>1. Splitter</span>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <span
                                draggable
                                onDragEnd={() => this.setState({ splitterDragging: false })}
                                onDragStart={e => {
                                    e.dataTransfer.setData('text', JSON.stringify({ split: true }));
                                    this.setState({ splitterDragging: true })
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    marginLeft: '5%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    backgroundColor: 'transparent !important'
                                }}
                            >
                                {this.state.splitterDragging ? (

                                    <Icon name="cut"
                                        size="large"
                                        style={{ transform: 'rotateZ(270deg)' }}
                                    />
                                ) : (
                                        <SplitterIcon />
                                    )}
                                {this.state.splitterDragging && (
                                    <div>
                                        {formatTime(this.state.currentTime)}
                                    </div>
                                )}
                            </span>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={16} style={{ color: 'white', marginTop: 10, marginBottom: 10 }}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <span>2. No Speaker</span>
                        </Grid.Column>
                        <Grid.Column width={6} style={{ paddingLeft: 0 }}>
                            <div
                                draggable={true}
                                style={{
                                    backgroundColor: 'transparent',
                                    position: 'relative',
                                    color: 'white',
                                    cursor: 'pointer',
                                    height: 20,
                                    display: 'inline-block',
                                }}
                                onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker: { speakerNumber: -1 } }))}
                            >
                                <SpeakerDragItem speaker={{ speakerNumber: -1 }} />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Popup
                                trigger={<Icon name="info circle" />}
                                content="Intros, Extro, and all non-speech segments of the video."
                            />
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={16}>

                <Grid>
                    <Grid.Row style={{ position: 'relative', bottom: '-1rem', color: 'white' }}>
                        <Grid.Column width={16}>
                            <span>
                                <u>
                                    3. Number of speakers:
                                </u>
                            </span>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {this.props.article && this.props.article.speakersProfile.sort((a, b) => a.speakerNumber - b.speakerNumber).map((speaker, index) => (
                            <Grid.Column width={16} style={{ marginTop: 10, marginBottom: 10 }} key={'speakers-sda' + index}>
                                <Grid>
                                    <Grid.Row style={{ listStyle: 'none', padding: 10, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid.Column width={6}>
                                            <span>Speaker {speaker.speakerNumber}</span>
                                        </Grid.Column>
                                        <Grid.Column width={5} style={{ paddingLeft: 0 }}>
                                            <div
                                                draggable={true}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    position: 'relative',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    height: 20,
                                                    display: 'inline-block',
                                                }}
                                                onDragStart={(e) => e.dataTransfer.setData('text', JSON.stringify({ speaker }))}
                                            >
                                                <SpeakerDragItem speaker={speaker} />
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width={index === this.props.article.speakersProfile.length - 1 ? 3 : 5}>
                                            <Dropdown
                                                value={speaker.speakerGender}
                                                options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                                                onChange={(e, { value }) => this.onSpeakerGenderChange(speaker, value)}
                                            />
                                        </Grid.Column>

                                        {index === this.props.article.speakersProfile.length - 1 && (
                                            <Grid.Column width={2}>
                                                <Button color="red" className="pull-right" onClick={() => this.onDeleteSpeaker(index)} icon="trash" size="tiny" />
                                            </Grid.Column>
                                        )}
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>

                        ))}
                        {/* <Grid.Column width={3}>
                            <Button color="blue" fluid onClick={this.onAddSpeaker} >Add Speaker</Button>
                        </Grid.Column> */}
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16} style={{ textAlign: 'right' }}>
                            <Button style={{ padding: '0.8rem' }} color="blue" onClick={this.onAddSpeaker} >Add Speaker</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Grid.Column>

        </Grid.Row>
    )

    renderProofreading = () => {
        const { article, backRoute } = this.props
        if (!article) return;

        return (
            <div className="proofreading">
                <Grid>
                    <Grid.Row id="top-container" style={{ padding: '5rem', paddingBottom: '1rem' }}>
                        <Grid.Column width={4}>
                            <div>
                                <a href={backRoute || '/'}>
                                    <Button id="back-btn" size="large" basic circular color="white" className="navigation-btns">
                                        <Icon name={"arrow left"} /> Back to videos
                                    </Button>
                                </a>
                            </div>
                            <div style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', color: 'white', padding: '1rem' }} >
                                <div style={{ display: 'inline-block', marginLeft: '2rem' }}>
                                    <Switch
                                        checked={this.props.nameSlides}
                                        onChange={this.props.setNameSlides}
                                        onColor="#86d3ff"
                                        onHandleColor="#2693e6"
                                        handleDiameter={30}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                        height={20}
                                        width={48}
                                    />
                                </div>
                                Name Slides

                            </div>

                            {this.props.nameSlides && this.props.selectedSubtitle && this.props.selectedSubtitle.subtitle && (
                                <div style={{ marginLeft: 20 }}>
                                    <SubtitleNameForm
                                        subtitle={this.props.selectedSubtitle.subtitle}
                                        onSave={({ name }) => {
                                            this.onSaveSubtitle(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex, { name })
                                        }}
                                    />
                                </div>
                            )}
                            {this.props.article && this.props.article.langCode !== 'en-US' && (
                                <div style={{ color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', padding: '1rem' }}>

                                    <div style={{ marginLeft: '2rem', display: 'inline-block' }}>
                                        <Switch
                                            checked={this.props.article.toEnglish}
                                            onChange={this.props.updateToEnglish}
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={30}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={20}
                                            width={48}
                                        />
                                    </div>

                                    <span>
                                        Transcribe directly to English
                                    </span>
                                    <Popup
                                        trigger={<Icon name="info circle" style={{ marginLeft: 10 }} />}
                                        content="Activate this feature if you are transcribing (adding subtitles) to a local language video directly into English"
                                    />
                                </div>

                            )}
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <div style={{ width: '100%', height: '100%' }}>
                                {this.props.video && (
                                    <ProofreadingVideoPlayer
                                        width={'100%'}
                                        duration={this.state.duration}
                                        currentTime={this.state.currentTime}
                                        onVideoLoad={this.onVideoLoad}
                                        playing={this.state.videoPlaying}
                                        onTimeChange={this.onTimeChange}
                                        videoRef={(ref) => this.videoRef = ref}
                                        url={this.props.video.url}
                                        onPlayToggle={this.onPlayToggle}
                                        extraContent={
                                            (
                                                <p
                                                    onClick={() => this.setState({ isFindAndReplaceModalVisible: true })}
                                                    style={{ color: 'white', cursor: 'pointer' }}
                                                >
                                                    Find & Replace
                                                </p>
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {this.canSaveAndComplete() && (
                                                <Button color="blue" size="large" circular onClick={() => this.setState({ isConfirmConvertModalVisible: true })} >
                                                    Save & Complete <Icon name={"arrow right"} />
                                                </Button>
                                            )}
                                            {this.canMarkAsDone() && (
                                                <Button color="blue" size="large" circular onClick={() => this.setState({ isConfirmDoneModalVisible: true })} >
                                                    Mark As Done <Icon name={"arrow right"} />
                                                </Button>
                                            )}
                                            {this.renderConvertConfirmModal()}
                                            {this.renderDoneConfirmModal()}
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>

                                <Grid.Row>
                                    <Grid.Column width={16} className="speakers-box-container">
                                        <Grid className="speakers-box">
                                            <h2 style={{ color: 'white' }}>
                                                Basic tools:
                                            </h2>
                                            {this.renderSpeakersDragAndDrop()}
                                        </Grid>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Grid style={{ display: 'flex', justifyContent: 'center', marginBottom: '.2rem' }}>
                                <Grid.Row>
                                    <Grid.Column width={16} style={{ marginTop: 5, paddingLeft: 0 }}>
                                        {this.state.duration && (
                                            <VideoTimeline
                                                splitterDragging={this.state.splitterDragging}
                                                currentTime={this.state.currentTime}
                                                onTimeChange={this.onTimeChange}
                                                duration={this.state.duration}
                                                subtitles={this.props.subtitles}
                                                selectedSubtitleIndex={this.props.selectedSubtitle ? this.props.selectedSubtitle.subtitleIndex : null}
                                                onSubtitleChange={this.onSaveSubtitle}
                                                onAddSubtitle={this.onAddSubtitle}
                                                onSubtitleSelect={(subtitle, index) => this.props.setSelectedSubtitle(subtitle, index)}
                                                onSubtitleSplit={this.onSubtitleSplit}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={5} className="speakers-box-container">
                        </Grid.Column>
                        <Grid.Column width={11}>

                            {this.props.article && this.props.article.speakersProfile && this.props.selectedSubtitle && this.props.selectedSubtitle.subtitle ? (

                                <div style={{ width: '100%', padding: '2rem', marginTop: '3rem' }}>
                                    <SubtitleForm
                                        loading={this.props.updateSubslideState === 'loading'}
                                        subtitle={this.props.selectedSubtitle.subtitle}
                                        speakers={[{ speakerNumber: -1 }].concat(this.props.article.speakersProfile)}
                                        showTextArea={this.props.selectedSubtitle.subtitle.speakerProfile.speakerNumber !== -1}
                                        onOpenFindAndReplace={() => this.setState({ isFindAndReplaceModalVisible: true })}
                                        onFindAndReplaceSubmit={({ find, replace }) => this.props.findAndReplaceText(find, replace)}
                                        onSave={(changes) => {
                                            let { text, speakerNumber, startTime, endTime } = changes;
                                            if (typeof startTime === 'number' || typeof endTime === 'number') {
                                                this.onSaveSubtitle(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex, changes)
                                            } else {

                                                let speakerProfile = this.props.article.speakersProfile.find((speaker) => speaker.speakerNumber === speakerNumber);
                                                if (speakerNumber !== -1) {
                                                    speakerProfile = this.props.article.speakersProfile.find((speaker) => speaker.speakerNumber === speakerNumber);
                                                } else {
                                                    speakerProfile = { speakerNumber: -1 };
                                                    text = ''
                                                }

                                                this.onSaveSubtitle(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex, { text, speakerProfile })
                                            }
                                        }}
                                        onDelete={() => this.onSubslideDelete(this.props.selectedSubtitle.subtitle, this.props.selectedSubtitle.subtitleIndex)}
                                    />
                                </div>
                            ) : (
                                    <div style={{ height: 150 }}></div>
                                )}
                            <FindAndReplaceModal
                                mountNode={document.getElementsByClassName('proofreading')[0]}
                                open={this.state.isFindAndReplaceModalVisible}
                                onClose={() => this.setState({ isFindAndReplaceModalVisible: false })}
                                onSubmit={({ find, replace }) => {
                                    this.setState({ isFindAndReplaceModalVisible: false });
                                    this.props.findAndReplaceText(find, replace);
                                }}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            </div >
        )
    }

    renderDone = () => {
        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: successLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div key={'lottie-success'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Lottie options={defaultOptions}
                    height={400}
                    width={400}
                />
            </div>
        )
    }

    renderLoader = () => {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <Lottie options={defaultOptions} height={400} width={400} />
        )
    }

    render() {
        if (!this.props.user || !this.props.organization) return null;
        return (
            <Styled styles={styles}>
                {/* <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
                <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans&display=swap" rel="stylesheet"></link> */}
                {/* <link rel="" href="assets/fonts/proxima_ssv/ProximaNova-Regular.otf" /> */}
                <div style={{ height: '100%' }}>
                    <Grid >
                        <Grid.Row>
                            <Grid.Column width={16}>
                                {this.renderProofreading()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Styled>
        )
    }
}

const mapStateToProps = ({ proofread }) => ({
    video: proofread.video,
    fetchVideoState: proofread.fetchVideoState,
    article: proofread.article,
    fetchArticleState: proofread.fetchArticleState,
    updateSubslideState: proofread.updateSubslideState,
    subtitles: proofread.subtitles,
    selectedSubtitle: proofread.selectedSubtitle,
    stages: proofread.convertStages.stages,
    activeStageIndex: proofread.convertStages.activeStageIndex,
    toEnglish: proofread.toEnglish,
    nameSlides: proofread.nameSlides,
    user: proofread.user,
    organization: proofread.organization,
})

const mapDispatchToProps = (dispatch) => ({
    fetchVideoById: (id) => dispatch(actions.fetchVideoById(id)),
    resetState: () => dispatch(actions.reset()),
    resetArticleState: () => dispatch(actions.reset()),
    convertVideoToArticle: (finishRedirectRoute, videoId, articleId, toEnglish) => dispatch(actions.convertVideoToArticle(finishRedirectRoute, videoId, articleId, toEnglish)),
    markVideoAsDone: (videoId, articleId) => dispatch(actions.markVideoAsDone(videoId, articleId)),
    setToEnglish: (toEnglish) => dispatch(actions.setToEnglish(toEnglish)),
    updateToEnglish: (toEnglish) => dispatch(actions.updateToEnglish(toEnglish)),

    setNameSlides: (nameSlides) => dispatch(actions.setNameSlides(nameSlides)),
    fetchArticleByVideoId: id => dispatch(actions.fetchArticleByVideoId(id)),
    updateSubslide: (slidePosition, subslidePosition, changes) => dispatch(actions.updateSubslide(slidePosition, subslidePosition, changes)),
    onSplitSubslide: (slidePosition, subslidePosition, wordIndex, currentTime) => dispatch(actions.splitSubslide(slidePosition, subslidePosition, wordIndex, currentTime)),
    addSubslide: subslide => dispatch(actions.addSubslide(subslide)),
    onDeleteSubslide: (slidePosition, subslidePosition) => dispatch(actions.deleteSubslide(slidePosition, subslidePosition)),
    setSlidesToSubtitles: slides => dispatch(actions.setSlidesToSubtitles(slides)),
    setSubtitles: subtitles => dispatch(actions.setSubtitles(subtitles)),
    setSelectedSubtitle: (subtitle, index) => dispatch(actions.setSelectedSubtitle(subtitle, index)),
    onSpeakersChange: speakers => dispatch(actions.updateSpeakers(speakers)),
    findAndReplaceText: (find, replace) => dispatch(actions.findAndReplaceText(find, replace)),
    // this.props.fetchUserData(this.props.apiKey)
    // this.props.fetchOrganizationData(this.props.apiKey, this.props.organizationId)
    fetchUserData: () => dispatch(actions.fetchUserData()),
    fetchOrganizationData: (apiKey) => dispatch(actions.fetchOrganizationData(apiKey)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Proofread)
