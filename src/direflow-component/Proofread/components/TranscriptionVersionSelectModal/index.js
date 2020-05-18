import React from 'react';
import { Modal, Label, Icon, Button, Dropdown } from 'semantic-ui-react';
import Lottie from 'react-lottie';
import robotLottie from './robot.json'

class TranscriptionVersionSelectModal extends React.Component {
    state = {
        selectedTranscribeAllIndex: null,
    }
    
    renderLoader = () => {
        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: robotLottie,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        return (
            <Lottie options={defaultOptions} height={100} width={100} />
        )
    }

    render() {
        const { open, onClose, subslide, versionedSubslides, onVersionChange, transcriptionVersions } = this.props;
        if (!open) return null;
        return (
            <Modal
                size="tiny"
                open={open}
                onClose={onClose}
            >

                <Modal.Header>
                    <h4>
                        {(transcriptionVersions || []).length} versions available
                        <Button
                            circular
                            basic
                            icon="close"
                            style={{ position: 'absolute', top: 10, right: 10 }}
                            onClick={onClose}
                        />
                    </h4>
                </Modal.Header>
                <Modal.Content>
                    {versionedSubslides.length === 0 ? (
                        <div>
                            <strong>No versions available</strong>
                        </div>
                    ) : (
                            <div>
                                {versionedSubslides.map((versionedSubslide, index) => {
                                    const notCurrentVersion = !subslide.transcriptionVersionArticleId || (subslide.transcriptionVersionArticleId !== versionedSubslide.articleId);
                                    const bgColor = notCurrentVersion ? '#d4e0ed' : '#1d3348';
                                    const color = notCurrentVersion ? 'rgba(0,0,0,.6)' : 'white';
                                    const loading = versionedSubslide.AITranscriptionLoading;

                                    return (
                                        <div key={`versioned-subslide-${index}`} style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Label
                                                    style={{
                                                        borderBottomRightRadius: '0',
                                                        borderBottomLeftRadius: '0',
                                                        fontSize: '0.8rem',
                                                        backgroundColor: bgColor,
                                                        color,
                                                    }}
                                                >
                                                    {versionedSubslide.isAITranscription ? (<span>AI Transcription</span>) : `Translator ${index + 1} `}
                                                </Label>

                                                
                                                {notCurrentVersion ? (
                                                    <div style={{ color: '#0e7ceb', cursor: 'pointer' }} onClick={() => onVersionChange(versionedSubslide.articleId)}>
                                                        Use this version
                                                    </div>
                                                ) : (
                                                        <span>
                                                            <Icon name="check circle" color="green" />
                                                        </span>
                                                    )
                                                }
                                            </div>
                                            <div style={{ padding: '1rem', border: `solid 1px ${bgColor}` }}>
                                                {loading ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                        {this.renderLoader()}
                                                        <span>Working on it...</span>
                                                    </div>
                                                ) : (
                                                        <span>{versionedSubslide.text}</span>
                                                    )}
                                            </div>
                                        </div>
                                    )
                                }
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <span style={{ marginRight: 20 }}>Transcript all slides by</span>
                                    <Dropdown
                                        style={{ marginRight: 20 }}
                                        placeholder="Choose translator"
                                        value={this.state.selectedTranscribeAllIndex}
                                        onChange={(e, data) => this.setState({ selectedTranscribeAllIndex: data.value })}
                                        options={transcriptionVersions.map((t, index) => ({ text: `Translator ${index + 1}`, value: index, key: `translator-select-${index + 1}` }))}
                                    />
                                    <Button
                                        disabled={this.state.selectedTranscribeAllIndex === null}
                                        primary
                                        basic
                                        onClick={() => this.props.onSetVersionOnAllSlides(transcriptionVersions[this.state.selectedTranscribeAllIndex]._id)}
                                    >
                                        Go
                                    </Button>
                                </div>
                            </div>
                        )}
                </Modal.Content>
            </Modal>
        )
    }
}


export default TranscriptionVersionSelectModal;