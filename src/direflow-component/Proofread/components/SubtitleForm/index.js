import React from 'react';
import PropTypes from 'prop-types';
import { Button,  Popup, Card, Label, TextArea, Icon,  } from 'semantic-ui-react';
import { debounce, formatTime, unformatTime, isTimeFormatValid } from '../../utils/helpers';
import { Styled } from 'direflow-component';
import styles from './style.scss';


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
        const { speakers, subtitle, title } = this.props;
        return (
            <Styled styles={styles}>
                {subtitle && speakers && (
                <Card style={{ marginBottom: '2rem', width: '100%', marginTop: '2.7rem', borderRadius: 0 }} className="translate-box">
                    <Card.Header style={{ backgroundColor: '#d4e0ed', color: '', borderRadius: 0 }}>
                        <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <h4 style={{ color: '#333333', margin: 0, padding: '1rem' }}>
                                {title}
                            </h4>
                            <Button
                                basic
                                className="translate-box__update-button"
                                style={{ backgroundColor: 'transparent', boxShadow: 'none !important', margin: 0, padding: '1rem' }}
                                loading={this.props.loading}
                                onClick={() => this.onSave(true)}
                                disabled={this.isSaveDisabled()}
                            >
                                Update
                            </Button>
                        </div>
                    </Card.Header>
                    <div
                        style={{ margin: 0, padding: 0, position: 'relative' }}
                    >
                        <Popup
                            trigger={
                                <Button
                                    icon="edit"
                                    basic
                                    onClick={this.props.onFindAndReplaceOpen}
                                    style={{ position: 'absolute', right: -3, top: 1 }}
                                />
                            }
                            content="Find and replace text"
                        />
                        <Label onClick={this.props.onOpenTranslationVersions} className="translate-box__versions-available">{this.props.transcriptionVersionsCount || 0} versions available <Icon name="chevron down" /></Label>
                        <TextArea
                            style={{ padding: 20, paddingRight: 40, width: '100%', border: 'none' }}
                            rows={6}
                            placeholder="Translate slide text"
                            disabled={!this.props.showTextArea}
                            value={this.state.text}
                            onChange={(e) => this.setState({ text: e.target.value })}
                            onBlur={() => this.onSave(true)}
                        />
                    </div>
                </Card>
                )}
            </Styled>

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