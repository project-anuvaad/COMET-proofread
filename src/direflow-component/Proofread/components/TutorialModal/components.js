import React from 'react';
import { Grid, Icon, Button } from 'semantic-ui-react';

export class NoteGrid extends React.Component {

    render() {
        const { title, note, image } = this.props;

        return (
            <Grid style={{ marginTop: '2rem' }}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {title && (
                            <h4 style={{ fontSize: '2rem', textAlign: 'center' }}>
                                {title}
                            </h4>
                        )}
                        {note && (
                            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                {note}
                            </p>
                        )}
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <img style={{ }} src={image} width="100%" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export class SingleTitleAndContentGrid extends React.Component {

    render() {
        const { title, content } = this.props;

        return (
            <div style={{ width: '100%', margin: 'auto' }}>
                {title && (
                    <p style={{ margin: '2rem', textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
                        {title}
                    </p>
                )}
                {content && (
                    <div style={{ textAlign: 'left', width: '50%', margin: '0 auto' }}>
                        {content}
                    </div>
                )}
            </div>
        )
    }
}

export class MultiStepsGrid extends React.Component {
    state = {
        currentStep: 0,
        ended: false,
    }

    onNextStep = () => {
        const { currentStep } = this.state;
        const { steps } = this.props;

        if (currentStep < steps.length - 1) {
            const nextStepIndex = currentStep + 1;
            const nextStep = steps[nextStepIndex];
            this.setState({ currentStep: nextStepIndex });

            if (nextStep.mediaType === 'gif' && nextStep.mediaDuration) {
                setTimeout(() => {
                    this.onNextStep();
                }, nextStep.mediaDuration);
            } else if (nextStep.mediaType === 'video') {
            }
        } else {
            this.setState({ ended: true })
        }
    }

    onRepeat = () => {
        this.setState({ currentStep: -1, ended: false }, () => {
            this.onNextStep();
        })
    }

    render() {
        const { steps } = this.props;
        return (
            <div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem', paddingBottom: 0 }}>
                    <Button
                        disabled={!this.state.ended}
                        primary
                        onClick={this.onRepeat}
                    >
                        <Icon name="refresh" /> Repeat
                    </Button>
                </div>
                <Grid>
                    <Grid.Row>
                        {steps.map((step, index) => (
                            (index <= this.state.currentStep ? (
                                <Grid.Column
                                    key={`multi-step-grid-step-${step.title}`}
                                    width={8}
                                    style={{ padding: '1rem', paddingBottom: 0 }}>
                                    <h4>
                                        {step.title}
                                    </h4>
                                    {step.mediaType === 'video' ? (

                                        <video
                                            ref={(ref) => this[`videoRef${index}`] = ref}
                                            autoPlay
                                            width="100%"
                                            controls
                                            src={step.mediaUrl}
                                            onEnded={() => {
                                                console.log('on ended');
                                                this.onNextStep()
                                            }}
                                        />

                                    ) : (
                                            <img width="100%" src={step.mediaUrl} />
                                        )}
                                </Grid.Column>
                            ) : null)
                        ))}
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

