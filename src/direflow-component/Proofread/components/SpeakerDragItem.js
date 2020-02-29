import React from 'react';
import { SPEAKER_BACKGROUND_COLORS } from '../constants';

export default class SpeakerDragItem extends React.Component {

    render() {
        const { speaker } = this.props;

        return (
            <React.Fragment>

                <div
                    style={{
                        height: 20,
                        background: SPEAKER_BACKGROUND_COLORS[speaker.speakerNumber] || 'white',
                        paddingLeft: 15,
                        width: 80,
                        borderRadius: 10,
                    }}
                >
                </div>
                {/* <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        height: 20,
                        width: 10,
                        left: 0,
                        zIndex: 5,
                    }}
                >
                    <span style={{ background: '#A2A3A4', position: 'absolute', height: '100%', width: 10 }} >
                        {'<'}
                    </span>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        height: 20,
                        width: 10,
                        left: 80,
                        zIndex: 5,
                    }}
                >
                    <span style={{ background: '#A2A3A4', position: 'absolute', height: '100%', width: 10 }} >
                        {'>'}
                    </span>
                </div> */}
            </React.Fragment>
        )
    }
}