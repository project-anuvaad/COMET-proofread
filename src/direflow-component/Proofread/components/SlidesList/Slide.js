import React from "react";

import PropTypes from "prop-types";
import classnames from "classnames";
import { Icon, Input, Button, Dropdown, Popup } from "semantic-ui-react";
import {
  formatTime,
  unformatTime,
  isTimeFormatValid,
  removeMillisecondsFromFormattedTime,
  debounce,
} from "../../utils/helpers";
import { SPEAKER_BACKGROUND_COLORS } from "../../constants";

export default class Slide extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: "",
      endTime: "",
      seconds: 0,
      speakerNumber: null,
    };
    this.debouncedSave = debounce(({ field, value }) => {
      this.props.onChange({ [field]: value });
    }, 1000);
  }

  componentDidMount = () => {
    if (this.props.slide) {
      const { speakerProfile, startTime, endTime } = this.props.slide;
      this.updateTimings({
        speakerNumber: speakerProfile ? speakerProfile.speakerNumber : null,
        startTime,
        endTime,
        seconds: endTime - startTime,
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.slide !== nextProps.slide) {
      const { startTime, endTime } = nextProps.slide;
      const { speakerNumber } = nextProps.slide.speakerProfile;
      this.updateTimings({ startTime, endTime, speakerNumber });
    }
  };

  updateTimings = ({ startTime, endTime, speakerNumber }) => {
    const seconds = parseFloat((endTime - startTime) / 1000);
    this.setState({
      speakerNumber,
      startTime: formatTime(startTime, { milliseconds: true }),
      endTime: formatTime(endTime, { milliseconds: true }),
      seconds: seconds === 0 ? "" : seconds,
    });
  };

  onSecondsChange = (e) => {
    let seconds = this.state.seconds;
    const value = e.target.value || 0;
    if (Number.isInteger(parseInt(value))) {
      seconds = parseFloat(value);
    }
    let { startTime, endTime, speakerProfile } = this.props.slide;
    endTime = startTime + parseFloat(seconds) * 1000;
    this.updateTimings({
      startTime,
      endTime,
      speakerNumber: speakerProfile.speakerNumber,
    });
    this.debouncedSave({ field: "endTime", value: endTime / 1000 });
  };

  onTimeBlur = (e) => {
    const fieldName = e.target.name;
    const formattedValue = this.state[fieldName];
    const unformattedTime = unformatTime(formattedValue);
    if (
      unformatTime(
        formatTime(this.props.slide[fieldName], { milliseconds: true })
      ).totalMilliseconds !== unformattedTime.totalMilliseconds
    ) {
      this.props.onChange({
        [fieldName]: unformattedTime.totalMilliseconds / 1000,
      });
    }
  };

  onTimeChange = (e) => {
    const fieldName = e.target.name;
    if (isTimeFormatValid(e.target.value)) {
      this.setState({ [fieldName]: e.target.value });
      const newValue = unformatTime(e.target.value).totalMilliseconds / 1000;
      this.debouncedSave({ field: fieldName, value: newValue });
    }
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  render() {
    const { slide, index, active, editable, speakers } = this.props;
    const durationInSeconds = (slide.endTime - slide.startTime) / 1000;
    let stateIcon;
    if (durationInSeconds <= 15) {
      stateIcon = (
        <Popup
          trigger={
            <Icon
              name="check circle"
              color="green"
              style={{ marginLeft: 10 }}
            />
          }
          content="0-15 seconds - Ideal slide length"
        />
      );
    } else if (durationInSeconds <= 20) {
      stateIcon = (
        <Popup
          trigger={
            <Icon
              name="warning sign circle"
              color="orange"
              style={{ marginLeft: 10 }}
            />
          }
          content="15-20 seconds - excessive slide length"
        />
      );
    } else {
      stateIcon = (
        <Popup
          trigger={
            <Icon name="dont circle" color="red" style={{ marginLeft: 10 }} />
          }
          content="20 seconds and above - Not recommended slide length"
        />
      );
    }
    return (
      <div
        style={{
          borderColor:
            SPEAKER_BACKGROUND_COLORS[slide.speakerProfile.speakerNumber],
        }}
        className={classnames({ "slide-item": true, active })}
      >
        <span>
          Slide {index + 1} -{" "}
          {!editable ? (
            <small>
              {slide.speakerProfile.speakerNumber === -1
                ? "Intro/Extro/Music"
                : `Speaker ${slide.speakerProfile.speakerNumber}`}
            </small>
          ) : (
            <Dropdown
              options={speakers.map((s) => ({
                value: s.speakerNumber,
                text:
                  s.speakerNumber === -1
                    ? "Intro/Extro/Music"
                    : `Speaker ${s.speakerNumber} (${s.speakerGender})`,
                key: `Speaker-option-${s.speakerNumber}`,
              }))}
              value={slide.speakerNumber}
              onChange={(e, { value }) =>
                this.props.onChange({ speakerNumber: value })
              }
            />
          )}
          {stateIcon}
        </span>
        <div>
          <span className="timing">
            {!editable ? (
              <span>
                <span style={{ display: "inline-block", marginRight: 10 }}>
                  <small>
                    <strong>
                      {parseFloat(this.state.seconds || 0).toFixed(1)} Seconds
                    </strong>
                  </small>
                </span>
                {removeMillisecondsFromFormattedTime(this.state.startTime)} -{" "}
                {removeMillisecondsFromFormattedTime(this.state.endTime)}
              </span>
            ) : (
              <div>
                <span style={{ display: "inline-block", marginRight: 10 }}>
                  <Input
                    style={{ width: 60, marginRight: 10 }}
                    type="number"
                    min={0}
                    // input={<input />}
                    value={this.state.seconds}
                    size="mini"
                    name="endTime"
                    onClick={this.stopPropagation}
                    onChange={this.onSecondsChange}
                    onBlur={this.onTimeBlur}
                  />
                  <small>
                    <strong>Seconds</strong>
                  </small>
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
                  style={{
                    display: "inline-block",
                    width: 15,
                    textAlign: "center",
                  }}
                >
                  -
                </span>
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
                    this.props.onDelete();
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
    );
  }
}

Slide.propTypes = {
  slide: PropTypes.object,
  index: PropTypes.number,
  currentSlideIndex: PropTypes.number,
  currentSubslideIndex: PropTypes.number,
  editable: PropTypes.bool,
  active: PropTypes.bool,
};
