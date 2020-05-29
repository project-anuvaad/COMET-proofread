import React from 'react';
import styles from './style.scss';
import { Button } from 'semantic-ui-react';
import { Styled } from 'direflow-component';


export default class AnimatedButton extends React.Component {

    state = {
        animating: false,
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.animating && !this.animationInterval) {
            this.startAnimation()
        }
        if (!nextProps.animating && this.animationInterval) {
            this.stopAnimation();
        }
    }

    componentDidMount = () => {
        if (this.props.animating) {
            this.startAnimation();
        }

    }
    componentWillUnmount = () => {
        this.stopAnimation();
    }

    startAnimation = () => {
        if (this.animationInterval) return;
        this.animationInterval = setInterval(() => {
            this.setState({ animating: !this.state.animating })
        }, (this.props.animationInterval || 4000) / 2);
    }

    stopAnimation = () => {
        if (this.animationInterval) {
            clearInterval(this.animationInterval)
            this.animationInterval = null;
        }
    }

    getAnimationClass = () => {
        const { animation } = this.props;
        switch (animation) {
            case 'moema':
                return 'button--moema';
            default:
                return '';
        }
    }

    render() {
        let className = this.props.className;

        if (this.state.animating) {
            className += ' ' + this.getAnimationClass() + ' animate';
        }
        const { children, animation, ...rest } = this.props;

        return (
            <Styled styles={styles}>
                <Button
                    {...rest}
                    className={className}
                >
                    {children}
                </Button>
            </Styled>
        )
    }
}