import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './style.scss';
import { Styled } from 'direflow-component'
export default class ProgressBoxes extends React.Component {

  calculateWhite(percentage) {
    if (parseInt(percentage) === 100) return -5;
    return 100 - parseInt(percentage);
  }

  calculateGreen(percentage) {
    if (parseInt(percentage) === 100) return 0;
    return 100 - parseInt(percentage) + 5;
  }

  render() {
    const { stages } = this.props;
    return (
      <Styled styles={styles}>
        <div className="boxes-container">
          {stages.map((stage, index) => (
            <div className={classnames({ stage: true, active: stage.active })} key={`stage-${index}`}>
              {stage.title}
            </div>
          ))}
        </div>
      </Styled>
    )
  }
}

ProgressBoxes.propTypes = {
  stages: PropTypes.array,
}

ProgressBoxes.defaultProps = {

}
