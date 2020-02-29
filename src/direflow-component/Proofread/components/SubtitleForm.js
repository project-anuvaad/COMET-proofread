import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Grid, Modal, Popup, Input } from 'semantic-ui-react';
import { debounce, formatTime, unformatTime, isTimeFormatValid } from '../utils/helpers';

function mapSpeakersToDropdownOptions(speakers) {
    return speakers.map((speaker) => ({ text: speaker.speakerNumber === -1 ? 'Background Music' : `Speaker ${speaker.speakerNumber}`, value: speaker.speakerNumber }));
}

const DELETE_KEY_CODE = 46;

export default class SubtitleForm extends React.Component {
    state = {
        text: '',
        startTime: '',
        endTime: '',
        speakerNumber: null,
        isDeleteModalVisible: false,
        isFindAndReplaceModalVisible: false,
    }

    componentDidMount = () => {
        if (this.props.subtitle) {
            const { text, speakerProfile, startTime, endTime } = this.props.subtitle;

            this.setState({ text, speakerNumber: speakerProfile ? speakerProfile.speakerNumber : null, startTime: formatTime(startTime), endTime: formatTime(endTime) });
        }
        this.debouncedSave = debounce(() => {
            this.props.onSave({ text: this.state.text, speakerNumber: this.state.speakerNumber });
        }, 3000)
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.subtitle !== nextProps.subtitle) {
            const { text, startTime, endTime } = nextProps.subtitle;
            const { speakerNumber } = nextProps.subtitle.speakerProfile
            this.setState({ text, speakerNumber, startTime: formatTime(startTime), endTime: formatTime(endTime) });
        }
    }

    onTimeChange = (e) => {
        if (isTimeFormatValid(e.target.value)) {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    onTimeBlur = (e) => {
        const fieldName = e.target.name;
        const formattedValue = this.state[fieldName];
        const unformattedTime = unformatTime(formattedValue);
        if (unformatTime(formatTime(this.props.subtitle[fieldName])).totalMilliseconds !== unformattedTime.totalMilliseconds) {
            this.props.onSave({ [fieldName]: unformattedTime.totalMilliseconds / 1000 });
        }
    }

    isSaveDisabled = () => {
        const { subtitle, speakers, loading } = this.props;
        if (!subtitle || !speakers) return true;
        if (subtitle.text === this.state.text && subtitle.speakerProfile && subtitle.speakerProfile.speakerNumber === this.state.speakerNumber) return true;
        if (loading) return true;
        return false;
    }

    onSave = (immediate) => {
        console.log('on save')
        if (immediate) {
            this.props.onSave({ text: this.state.text, speakerNumber: this.state.speakerNumber });
        } else {
            this.debouncedSave();
        }
    }

    onDeleteSubtitle = () => {
        this.setState({ isDeleteModalVisible: true });
    }

    render() {
        const { speakers, subtitle } = this.props;
        return (
            <Grid>
                {subtitle && speakers ? (
                    <React.Fragment>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <Grid
                                    style={{ color: 'white' }}
                                >
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <div
                                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Dropdown
                                                    disabled={this.props.disableSpeakerUpdate}
                                                    item
                                                    value={this.state.speakerNumber}
                                                    options={mapSpeakersToDropdownOptions(speakers)}
                                                    onChange={(e, { value }) => this.setState({ speakerNumber: value }, () => this.onSave(true))}
                                                />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width={16}>
                                            <h3
                                                style={{ textAlign: 'center' }}
                                            >
                                                {typeof subtitle.index === 'number' && (
                                                    <span>
                                                        Slide {subtitle.index + 1}
                                                    </span>
                                                )}
                                            </h3>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Input
                                                    style={{ width: 80 }}
                                                    type="text"
                                                    value={this.state.startTime}
                                                    size="mini"
                                                    name="startTime"
                                                    onChange={this.onTimeChange}
                                                    onBlur={this.onTimeBlur}
                                                />
                                                <span
                                                    style={{ width: 20, textAlign: 'center' }}

                                                >-</span>
                                                <Input
                                                    style={{ width: 80 }}
                                                    type="text"
                                                    value={this.state.endTime}
                                                    size="mini"
                                                    name="endTime"
                                                    onChange={this.onTimeChange}
                                                    onBlur={this.onTimeBlur}
                                                />
                                            </div>
                                            <h3 style={{ textAlign: 'center' }}>
                                                {parseInt((this.props.subtitle.endTime - this.props.subtitle.startTime) / 1000)} Seconds
                                            </h3>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <div style={{ position: 'relative' }}>
                                    {!this.props.hideFindAndReplace && (
                                        <React.Fragment>

                                            <Popup
                                                trigger={
                                                    <Button
                                                        icon="edit"
                                                        basic
                                                        style={{ position: 'absolute', right: -2 }}
                                                        onClick={() => this.props.onOpenFindAndReplace()}
                                                    />
                                                }
                                                content="Find and Replace text"
                                            />

                                        </React.Fragment>
                                    )}
                                    <textarea
                                        disabled={!this.props.showTextArea}
                                        style={{ width: '100%', height: '100px', padding: 10, paddingRight: '2rem' }}
                                        value={this.state.text}
                                        onChange={(e) => this.setState({ text: e.target.value })}
                                        onBlur={() => this.onSave(true)}
                                    />
                                    <Button
                                        className="pull-right"
                                        style={{ marginTop: 10 }}
                                        color="blue"
                                        onClick={() => this.onSave(true)}
                                        loading={this.props.loading}
                                        disabled={this.isSaveDisabled()}
                                    >
                                        Save
                                </Button>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={2} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button icon="trash" onClick={this.onDeleteSubtitle} color="red" />
                            </Grid.Column>
                        </Grid.Row>
                    </React.Fragment>
                ) : null}
                <Modal open={this.state.isDeleteModalVisible} size="tiny" onClose={() => this.setState({ isDeleteModalVisible: false })}>
                    <Modal.Header>Delete Subtitle</Modal.Header>
                    <Modal.Content>
                        Are you sure you want to delete this item?
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => this.setState({ isDeleteModalVisible: false })}>Cancel</Button>
                        <Button color="red" onClick={() => { this.setState({ isDeleteModalVisible: false }); this.props.onDelete() }}>Yes</Button>
                    </Modal.Actions>
                </Modal>
            </Grid>
        )
    }
}

SubtitleForm.propTypes = {
    subtitle: PropTypes.object.isRequired,
    speakers: PropTypes.array.isRequired,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,

}

SubtitleForm.defaultProps = {
    onSave: () => { },
    onDelete: () => { },
}