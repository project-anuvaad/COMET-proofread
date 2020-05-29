import React from 'react';
import { Icon } from 'semantic-ui-react';
import { MultiStepsGrid, NoteGrid, SingleTitleAndContentGrid } from '../TutorialModal/components';


export const STAGES = [
    {
        title: 'Intro Music Slides',
        activeRange: [1, 1]
    },
    {
        title: 'Spaeker Slides',
        activeRange: [2, 4]
    },
    {
        title: 'Extro Music Slides',
        activeRange: [5, 7]
    }
];

export const STEP_CONTENT = {
    1: <MultiStepsGrid
        steps={[
            {
                title: 'Step 1: Pause when the intro music ends',
                mediaType: 'video',
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/Slide+1+video-+6+seconds.mp4'
            },
            {
                title: 'Step 2: Type how many seconds intro music is.',
                mediaType: 'gif',
                mediaDuration: 10200,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+1+gif+a.gif',
            },
            {
                title: 'You can see that the "White slide" automatically covered 6 seconds',
                mediaType: 'gif',
                mediaDuration: 10000,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+1+gif+b.gif'
            },
        ]}
    />
    ,
    2: <SingleTitleAndContentGrid
        title="When a speaker is speaking in the video - the ideal slide length is 10-15 seconds (1-2 sentences)"
        content={(
            <React.Fragment>
                <div style={{ color: 'gray', marginBottom: '1rem' }}>
                    <Icon name="check" size="large" color="green" />
                    0-15 seconds - Ideal slide length
                    </div>
                <div style={{ color: 'gray', marginBottom: '1rem', }}>
                    <Icon name="warning sign" size="large" color="yellow" />
                    15-20 seconds - Caution - excessive slide length
                    </div>
                <div style={{ color: 'gray', marginBottom: '1rem' }}>
                    <Icon name="dont" size="large" color="red" />

                    20 seconds and above - Not recommended slide length
                </div>

            </React.Fragment>
        )}
    />,
    3: <MultiStepsGrid
        steps={[
            {
                title: 'Step 1: Pause when the speaker speaks 1-2 sentences.',
                mediaType: 'video',
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/Slide+3+video++-+12+seconds.mp4'
            },
            {
                title: 'Step 2: Type how many seconds the speaker spoke for.',
                mediaType: 'gif',
                mediaDuration: 15000,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+3+gif+a.gif',
            },
            {
                title: 'You can see that the speaker slide automatically moved to 18 seconds.',
                mediaType: 'gif',
                mediaDuration: 16000,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+3+gif+b.gif',
            }
        ]}
    />,
    4: <SingleTitleAndContentGrid
        title="You can adjust the timing of the slide perfectly by dragging the slide."
        content={(
            <video
                autoPlay
                controls
                src="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/Slide+4+video+mp4.mp4"
                width="100%"
            />
        )}
    />
    ,
    5: <MultiStepsGrid
        steps={[
            {
                title: 'Step 1: Pause when the extro music ends.',
                mediaType: 'video',
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/Slide+5+video+-+7+seconds.mp4'
            },
            {
                title: 'Step 2: Type how many seconds extro music is.',
                mediaType: 'gif',
                mediaDuration: 16000,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/Slide+5+gif+a.gif',
            },
            {
                title: 'You can see that the "white slide" automatically covers the extro music.',
                mediaType: 'gif',
                mediaDuration: 18000,
                mediaUrl: 'https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+5+gif+b.gif',
            }
        ]}

    />,
    6: <NoteGrid
        title="One last point"
        note="Don't forget to assign the correct gender to the speakers"
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+6+image.png"
    />,
    7: <NoteGrid
        title="Well done!"
        note={`Just click on the "Save" button`}
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/cutting_video/slide+7+image.png"
    />

}
