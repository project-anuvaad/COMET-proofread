import React from 'react';
import { Modal, Grid, Input, Button, Form } from 'semantic-ui-react';

export default class FindAndReplaceModal extends React.Component {
    state = {
        find: '',
        replace: '',

    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.open !== this.props.open) {
            this.setState({ find: '', replace: '' });
        }
    }

    render() {
        return (
            <Modal
                mountNode={this.props.mountNode}
                open={this.props.open}
                size="tiny"
            >
                <Modal.Header>
                    <h3>Find and Replace</h3>
                </Modal.Header>
                <Modal.Content >
                    <Grid>
                        <Grid.Row style={{ dispaly: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid.Column width={4}>
                                Find
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Input
                                    fluid
                                    type="text"
                                    value={this.state.find}
                                    onChange={(e, { value }) => this.setState({ find: value })}
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row style={{ dispaly: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid.Column width={4}>
                                Replace with
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Input
                                    fluid
                                    type="text"
                                    value={this.state.replace}
                                    onChange={(e, { value }) => this.setState({ replace: value })}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        primary
                        disabled={!this.state.find || !this.state.replace}
                        onClick={() => this.props.onSubmit(this.state)}
                    >
                        Replace
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}