import React from 'react';
import { Input } from 'semantic-ui-react';
import { debounce } from '../utils/helpers';

export default class SubtitleNameForm extends React.Component {
    state = {
        name: '',
    }
    constructor(props) {
        super(props);
        this.debouncedSave = debounce(() => {
            this.props.onSave({ name: this.state.name });
        }, 2000)
    }
    
    componentDidMount = () => {
        
        if (this.props.subtitle) {
            const { name } = this.props.subtitle;
            this.setState({ name: name || '' });
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.subtitle !== nextProps.subtitle) {
            const { name } = nextProps.subtitle;
            this.setState({ name });
        }
    }
    onSave = () => {
        console.log('on save')
        this.debouncedSave();
    }

    render() {
        return (
            <Input
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value }, this.onSave)}
            />
        )
    }
}