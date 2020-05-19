import React from 'react';

import PropTypes from 'prop-types'
import classnames from 'classnames';
import { Icon, Input, Button, Dropdown } from 'semantic-ui-react';
import { formatTime, unformatTime, isTimeFormatValid, removeMillisecondsFromFormattedTime } from '../../utils/helpers';
import { SPEAKER_BACKGROUND_COLORS } from '../../constants';

export default class Slide extends React.Component {
    state = {
        startTime: '',
        endTime: '',
        speakerNumber: null,
    }
    componentDidMount = () => {
        if (this.props.slide) {
            const { speakerProfile, startTime, endTime } = this.props.slide;
            this.setState({ speakerNumber: speakerProfile ? speakerProfile.speakerNumber : null, startTime: formatTime(startTime, { milliseconds: true }), endTime: formatTime(endTime, { milliseconds: true }) });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.slide !== nextProps.slide) {
            const { startTime, endTime } = nextProps.slide;
            const { speakerNumber } = nextProps.slide.speakerProfile
            this.setState({ speakerNumber, startTime: formatTime(startTime, { milliseconds: true }), endTime: formatTime(endTime, { milliseconds: true }) });
        }
    }

    onTimeBlur = (e) => {
        const fieldName = e.target.name;
        const formattedValue = this.state[fieldName];
        const unformattedTime = unformatTime(formattedValue);
        if (unformatTime(formatTime(this.props.slide[fieldName], { milliseconds: true })).totalMilliseconds !== unformattedTime.totalMilliseconds) {
            this.props.onChange({ [fieldName]: unformattedTime.totalMilliseconds / 1000 });
        }
    }


    onTimeChange = (e) => {
        if (isTimeFormatValid(e.target.value)) {
            this.setState({ [e.target.name]: e.target.value })
        }
    }

    stopPropagation = (e) => { e.stopPropagation() }

    render() {
        const { slide, index, active, editable, speakers } = this.props;
        
        return (
            <div
                style={{ borderColor: SPEAKER_BACKGROUND_COLORS[slide.speakerProfile.speakerNumber ]}}
                className={classnames({ "slide-item": true, active })}
            >
                <span>
                    Slide {index + 1} - {!editable ? (
                        <small>{slide.speakerProfile.speakerNumber === -1 ? 'Intro/Extro/Music' : `Speaker ${slide.speakerProfile.speakerNumber}`}</small>
                    ) : (
                            <Dropdown
                                options={speakers.map(s => ({ value: s.speakerNumber, text: s.speakerNumber === -1 ? 'Intro/Extro/Music' : `Speaker ${s.speakerNumber} (${s.speakerGender})`, key: `Speaker-option-${s.speakerNumber}` }))}
                                value={slide.speakerNumber}
                                onChange={(e, { value }) => this.props.onChange({ speakerNumber: value })}
                            />
                        )}
                </span>
                <div>
                    <span className="timing">
                        {!editable ? (
                            <span>
                                <span
                                    style={{ display: 'inline-block', marginRight: 10 }}
                                >
                                    <small><strong>{parseInt((slide.endTime - slide.startTime) / 1000)} Seconds</strong></small>
                                </span>
                                {(removeMillisecondsFromFormattedTime(this.state.startTime))} - {removeMillisecondsFromFormattedTime(this.state.endTime)}
                            </span>
                        ) : (
                                <div>
                                    <span
                                        style={{ display: 'inline-block', marginRight: 10 }}
                                    >
                                        <small><strong>{parseInt((unformatTime(this.state.endTime).totalSeconds - unformatTime(this.state.startTime).totalSeconds))} Seconds</strong></small>
                                    </span>
                                    <Input
                                        style={{ width: 75 }}
                                        type="text"
                                        value={this.state.startTime}
                                        size="mini"
                                        name="startTime"
                                        onClick={this.stopPropagation}
                                        onChange={this.onTimeChange}
                                        onBlur={this.onTimeBlur}
                                    />
                                    <span
                                        style={{ display: 'inline-block', width: 15, textAlign: 'center' }}

                                    >-</span>
                                    <Input
                                        style={{ width: 75 }}
                                        type="text"
                                        value={this.state.endTime}
                                        size="mini"
                                        name="endTime"
                                        onClick={this.stopPropagation}
                                        onChange={this.onTimeChange}
                                        onBlur={this.onTimeBlur}
                                    />
                                    <Button
                                        style={{ marginLeft: 10 }}
                                        size="mini"
                                        icon="trash"
                                        color="red"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.props.onDelete()
                                        }}
                                    />
                                </div>

                            )}
                    </span>
                    {slide.text && slide.audio && (
                        <Icon className="marker-icons" name="check circle" color="green" />
                    )}
                </div>
            </div>
        )
    }
}

Slide.propTypes = {
    slide: PropTypes.object,
    index: PropTypes.number,
    currentSlideIndex: PropTypes.number,
    currentSubslideIndex: PropTypes.number,
    editable: PropTypes.bool,
    active: PropTypes.bool,
}