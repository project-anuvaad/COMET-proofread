import React from "react";
import PropTypes from "prop-types";
import { Icon, Popup } from "semantic-ui-react";
import { Styled } from "direflow-component";
import styles from "./style.scss";
const STAGES = {
  CUTTING: 'cutting',
  PROOFREADING: 'proofreading',
}

const STAGES_TITLES = {
  [STAGES.CUTTING]: 'Cutting Video',
  [STAGES.PROOFREADING]: 'Proofreading Video',
}

export default class StagesProcess extends React.Component {
  render() {
    const { activeStage } = this.props;
    const stagesArray = Object.keys(STAGES).map(
      (k) => STAGES[k]
    );
    const activeStageIndex = stagesArray.indexOf(activeStage);
    return (
      <Styled styles={styles}>
        <div>
          {Object.keys(STAGES).map((stage, index) => (
            <div
              key={`stage-process-${stage}`}
              className="stage-processes__stage"
              onClick={(e) => {
                e.target.blur();
                this.props.onStageClick(STAGES[stage]);
              }}
              style={{
                position: "relative",
                padding: "10px 20px 10px 5px",
                cursor: "pointer",
                borderRadius: "1rem",
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {index === activeStageIndex && (
                <Icon
                  name="ellipsis horizontal"
                  circular
                  style={{ color: "white", backgroundColor: "orange" }}
                  size="tiny"
                />
              )}
              {index < activeStageIndex && (
                <Icon
                  name="check"
                  circular
                  style={{ color: "white", backgroundColor: "green" }}
                  size="tiny"
                />
              )}
              {index > activeStageIndex && (
                <Icon
                  name="check"
                  circular
                  style={{ color: "transparent", backgroundColor: "#d4e0ed" }}
                  size="tiny"
                />
              )}
              {index !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 28,
                    top: -12,
                    left: 11,
                    zIndex: -1,
                    background: index < activeStageIndex ? "green" : "#d4e0ed",
                  }}
                ></div>
              )}
              {STAGES_TITLES[STAGES[stage]]}
              <Popup
                trigger={<Icon className="info-icon" name="info circle" />}
                content="Click to see tutorial"
              />
            </div>
          ))}
        </div>
      </Styled>
    );
  }
}

StagesProcess.propTypes = {
  stages: PropTypes.object,
  activeStage: PropTypes.string,
};
