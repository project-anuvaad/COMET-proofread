import React from 'react';
import { NoteGrid } from '../TutorialModal/components';


export const STAGES = [
    {
        title: 'Step 1',
        activeRange: [1, 1]
    },
    {
        title: 'Step 2',
        activeRange: [2, 2]
    },

    {
        title: 'Step 3',
        activeRange: [3, 4]
    },

];

export const STEP_CONTENT = {
    1: <NoteGrid
        title={`Click on the "play" button to listen to the slide.`}
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/proofreading_video/proofread+1.jpg"
    />, 

    2: <NoteGrid
        title={`Write/Correct the text here.`}
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/proofreading_video/proofread+2.jpg"
    />, 

    3: <NoteGrid
        title={`Go to the next slide.`}
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/proofreading_video/proofread+3.jpg"
    />, 
    
    4: <NoteGrid
        title="Note:"
        note={`When you have completed all the slides (100%) - Click on "Save and Complete"`}
        image="https://tailoredvideowiki.s3-eu-west-1.amazonaws.com/static/tutorials_media/proofreading_video/proofread+4.jpg"
    />, 
}
