import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import styles from './style.scss';
import classnames from 'classnames';
import VideoStages from '../VideoStages';
import { Styled } from 'direflow-component';
import AnimatedButton from './AnimatedButton';

export default class TutorialModal extends React.Component {

    state = {
        currentStep: 1,
        nextButtonAnimating: false,
    }

    toggleOpen = () => {
        this.setState({ currentStep: 1, nextButtonAnimating: false, })
        if (this.props.open) {
            this.props.onClose();
        } else {
            this.props.onOpen()
        }
    }

    onBack = () => {
        const { currentStep } = this.state;

        if (currentStep > 1) {
            this.setState({ currentStep: currentStep - 1 })
        } else {
            this.setState({ currentStep: 1 })
        }
        this.setState({ nextButtonAnimating: false })
    }

    onNext = () => {
        const { currentStep } = this.state;
        const { numberOfSteps } = this.props;
        if (currentStep < numberOfSteps) {
            this.setState({ currentStep: currentStep + 1 });
        } else {
            this.setState({ currentStep: 1 });
            this.toggleOpen();
        }
        this.setState({ nextButtonAnimating: false })
    }

    getActivestage = () => {
        let activeStage;
        const { currentStep } = this.state;
        const { stages } = this.props;
        stages.forEach((s, i) => {
            if (currentStep >= s.activeRange[0] && currentStep <= s.activeRange[1]) {
                activeStage = s;
            }
        })
        return activeStage.title;
    }

    onStepEnded = () => {
        this.setState({ nextButtonAnimating: true });
    }

    render() {
        const { title, stages, stepContent, numberOfSteps, open } = this.props
        const ActiveStep = stepContent[this.state.currentStep]({ onEnded: this.onStepEnded });

        return (
            <Styled styles={styles}>
                <Modal
                    className="cutting-video-tutorial-modal"
                    onClose={this.toggleOpen}
                    open={open}
                >
                    <Modal.Header>
                        <h3>
                            {title}
                            <Button
                                circular
                                basic
                                icon="close"
                                onClick={this.toggleOpen}
                            />
                        </h3>
                        <div>
                            <VideoStages stages={stages} activeStage={this.getActivestage()} />
                        </div>
                    </Modal.Header>
                    <Modal.Content>
                        {ActiveStep}
                        <div className="bottom-content">

                            <div>
                                {[...Array(numberOfSteps).keys()].map(s => (
                                    <span className={classnames({ 'rectangle': true, 'active': s + 1 === this.state.currentStep })} ></span>
                                ))}
                            </div>
                            <div className="nav-buttons">
                                <Button disabled={this.state.currentStep === 1} className="back" circular onClick={this.onBack}>
                                    Back
                                </Button>
                                <AnimatedButton
                                    animating={this.state.nextButtonAnimating}
                                    animation="moema"
                                    animationInterval={2000}
                                    circular
                                    primary
                                    className="next"
                                    onClick={this.onNext}
                                >
                                    {this.state.currentStep < numberOfSteps ? 'Next' : 'Done'}
                                </AnimatedButton>
                            </div>
                        </div>
                    </Modal.Content>
                </Modal>
            </Styled>
        )
    }
}

TutorialModal.propTypes = {
    stages: PropTypes.array,
    numberOfSteps: PropTypes.number,
    stepContent: PropTypes.object,
}