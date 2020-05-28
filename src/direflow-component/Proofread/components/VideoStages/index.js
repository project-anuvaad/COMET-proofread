import React from 'react';
import { PropTypes } from 'prop-types'
import { Label } from 'semantic-ui-react';
import classnames from 'classnames';
import styles from './style.scss';
import { Styled } from 'direflow-component';


export const STAGES = [
    {
        title: 'Upload',
    },
    {
        title: 'Transcribe',
    },
    {
        title: 'Translate',
    }
]


export default class VideoStages extends React.Component {

    render() {
        const { activeStage, stages } = this.props;

        return (
            <Styled styles={styles}>
                <span className="video-stage">
                    {stages.map((s, i) => (
                        <span key={`stage-${s.title}`} className={classnames({ 'label-item': true, 'active': activeStage.toLowerCase() === s.title.toLowerCase() })}>
                            <Label circular>{i + 1}</Label> {s.title}
                        </span>
                    ))}
                </span>
            </Styled>
        )
    }
}

VideoStages.propTypes = {
    stages: PropTypes.array,
    activeStage: PropTypes.string,
}