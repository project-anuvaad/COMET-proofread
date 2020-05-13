import * as actionTypes from './types';
import Api from '../api';
import requestAgent from '../utils/requestAgent';
import { getSlideAndSubslideIndexFromPosition, generateConvertStages, removeExtension } from '../utils/helpers';

import { SPEAKER_BACKGROUND_COLORS, SPEAKER_TEXT_COLORS } from '../constants';

import NotificationService from '../utils/NotificationService';

const moduleName = 'proofread';

function formatSubslideToSubtitle(subslide) {
    return ({ ...subslide, startTime: subslide.startTime * 1000, endTime: subslide.endTime * 1000, text: subslide.text, speakerNumber: subslide.speakerProfile.speakerNumber, backgroundColor: SPEAKER_BACKGROUND_COLORS[subslide.speakerProfile.speakerNumber], color: SPEAKER_TEXT_COLORS[subslide.speakerProfile.speakerNumber] })
}

function generateSubtitlesFromSlides(slides) {
    let speakersIndexesMap = {};
    slides.reduce((acc, s) => acc.concat(s.content), []).map(s => s.speakerProfile).filter(s => s).forEach((s) => {
        speakersIndexesMap[s.speakerNumber] = 0;
    })
    return slides.
        reduce((acc, slide, slideIndex) => acc.concat(slide.content.map((s, subslideIndex) => ({ ...s, index: s.speakerProfile && typeof s.speakerProfile.speakerNumber === 'number' ? speakersIndexesMap[s.speakerProfile.speakerNumber] ++ : null,  slidePosition: slide.position, subslidePosition: s.position, slideIndex, subslideIndex }))), [])
        .filter((s) => !s.silent)
        .map(formatSubslideToSubtitle);
}


const fetchVideoLoading = () => ({
    type: actionTypes.FETCH_VIDEO_LOADING,
})



const fetchVideoSuccess = (video) => ({
    type: actionTypes.FETCH_VIDEO_SUCCESS,
    payload: video,
})

const fetchVideoFailed = (err) => ({
    type: actionTypes.FETCH_VIDEO_FAILED,
    payload: err,
})

const setArticle = article => ({
    type: actionTypes.SET_ARTICLE,
    payload: article,
})

const fetchArticleLoading = () => ({
    type: actionTypes.FETCH_ARTICLE_LOADING,
})

const fetchArticleSuccess = article => ({
    type: actionTypes.FETCH_ARTICLE_SUCCESS,
    payload: article,
})

const fetchArticleFailed = (err) => ({
    type: actionTypes.FETCH_ARTICLE_FAILED,
    payload: err,
})


const setStages = (stages, activeStageIndex) => ({
    type: actionTypes.SET_STAGES,
    payload: { stages, activeStageIndex },
})

export const reset = () => ({
    type: actionTypes.RESET,
})

export const setNameSlides = nameSlides => ({
    type: actionTypes.SET_NAME_SLIDES,
    payload: nameSlides,
})

export const setToEnglish = toEnglish => ({
    type: actionTypes.SET_TO_ENGLISH,
    payload: toEnglish,
})

const setUserData = user => ({
    type: actionTypes.SET_USER_DATA,
    payload: user,
})

const setOrganizationData = organization => ({
    type: actionTypes.SET_ORGANIZATION_DATA,
    payload: organization,
})

export const fetchUserData = () => dispatch => {
    requestAgent
    .get(Api.user.getUserDetails())
    .then(({ body }) => {
        dispatch(setUserData(body));
    })
    .catch(err => {
        console.log('error getting user data', err);
    })
}

export const fetchOrganizationData = (apiKey) => dispatch => {
    requestAgent
    .get(Api.apiKeys.getByKey(apiKey))
    .then(({ body }) => {
        console.log('============ got organization data', body)
        dispatch(setOrganizationData(body.apiKey.organization))
    })
    .catch(err => {
        console.log('error getting organization data', err);
    })
}


export const fetchVideoById = videoId => dispatch => {
    dispatch(fetchVideoLoading());
    requestAgent
        .get(Api.video.getVideoById(videoId))
        .then(res => {
            const video = res.body;
            const stages = generateConvertStages();
            let activeStageIndex = 0;
            switch (video.status) {
                case 'proofreading':
                case 'cutting':
                    stages[0].completed = true;
                    stages[1].active = true;
                    activeStageIndex = 1;
                    break;
                case 'converting':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].active = true;
                    activeStageIndex = 2;
                    break;
                case 'done':
                    stages[0].completed = true;
                    stages[1].completed = true;
                    stages[2].completed = true;
                    stages[0].active = true;
                    stages[1].active = true;
                    stages[2].active = true;
                    activeStageIndex = 3;
                    break;
                default:
                    stages[0].active = true;
            }
            dispatch(fetchVideoSuccess(video));
            dispatch(setStages(stages, activeStageIndex));
        })
        .catch(err => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            dispatch(fetchVideoFailed(reason));
        })
}


export const convertVideoToArticle = (finishRedirectRoute, videoId, articleId, toEnglish) => (dispatch, getState) => {
    requestAgent
        .post(Api.video.convertVideo(videoId), { articleId, toEnglish })
        .then(res => {
            console.log(res);
            const { queued, status } = res.body
            const { stages } = getState()[moduleName].convertStages;
            stages[0].completed = true;
            stages[1].completed = true;
            stages[2].active = true;
            if (status === 'proofreading') {
                NotificationService.success('The video has moved to proofreading stage successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
            if (finishRedirectRoute) {
                window.location.href = finishRedirectRoute || '/';
            } else {
                window.history.back();
            }
            // dispatch(push(`${routes.organziationReview()}?activeTab=proofread`))
        })
        .catch((err) => {
            console.log(err);
            const reason = err.response ? err.response.text : 'Something went wrong';
            NotificationService.error(reason);
        })
}



export const markVideoAsDone = (videoId, articleId) => (dispatch, getState) => {
    requestAgent
        .put(Api.article.markVideoAsDone(articleId), { reviewCompleted: true })
        .then((res) => {
            const article = { ...getState()[moduleName].article };
            article.reviewCompleted = true;
            NotificationService.success('Marked as done successfully');
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const updateToEnglish = (toEnglish) => (dispatch, getState) => {
    const article = { ...getState()[moduleName].article };
    requestAgent
        .put(Api.article.updateToEnglish(article._id), { toEnglish })
        .then((res) => {
            article.toEnglish = toEnglish;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}

export const fetchArticleByVideoId = videoId => dispatch => {
    dispatch(fetchArticleLoading());
    requestAgent
        .get(Api.article.getbyVideoId(videoId))
        .then((res) => {
            const article = res.body;
            dispatch(fetchArticleSuccess(article));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.error(reason)
            dispatch(fetchArticleFailed(reason));
        })
}

const updateSubslideLoading = () => ({
    type: actionTypes.UPDATE_SUBSLIDE_LOADING,
})

export const setSelectedSubtitle = (subtitle, subtitleIndex) => ({
    type: actionTypes.SET_SELECTED_SUBTITLE,
    payload: {
        subtitle,
        subtitleIndex
    }
})

export const setSlidesToSubtitles = (slides) => (dispatch, getState) => {
    const subtitles = generateSubtitlesFromSlides(slides);
    dispatch(setSubtitles(subtitles));
    const { selectedSubtitle } = getState()[moduleName];
    if (selectedSubtitle && selectedSubtitle.subtitle) {
        const subtitleIndex = subtitles.findIndex((s) => s.slidePosition === selectedSubtitle.subtitle.slidePosition && s.subslidePosition === selectedSubtitle.subtitle.subslidePosition);
        if (subtitleIndex !== -1) {
            dispatch(setSelectedSubtitle(subtitles[subtitleIndex], subtitleIndex));
        }
    } else if (subtitles) {
        dispatch(setSelectedSubtitle(subtitles[0], 0));
    }
}

const updateSubslideSuccess = (updatedArticle) => ({
    type: actionTypes.UPDATE_SUBSLIDE_SUCCESS,
    payload: updatedArticle
})

const updateSubslideFailed = (err) => ({
    type: actionTypes.UPDATE_SUBSLIDE_FAILED,
    payload: err,
})

export const setSubtitles = (subtitles) => ({
    type: actionTypes.SET_SUBTITLES,
    payload: [...subtitles],
})


export const updateSubslide = (slidePosition, subslidePosition, changes) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState()[moduleName].article };
    const { selectedSubtitle } = getState()[moduleName];
    const { slideIndex, subslideIndex } = getSlideAndSubslideIndexFromPosition(article.slides, slidePosition, subslidePosition);
    requestAgent
        .patch(Api.article.updateSubslide(article._id, slidePosition, subslidePosition), changes)
        .then((res) => {
            // const article = res.body;
            Object.keys(res.body.changes).forEach(key => {
                article.slides[slideIndex].content[subslideIndex][key] = res.body.changes[key];
                if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                    selectedSubtitle.subtitle[key] = res.body.changes[key];
                }
            })
            if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                dispatch(setSelectedSubtitle({ ...selectedSubtitle.subtitle }, selectedSubtitle.subtitleIndex));
            }
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));

        })
        .catch(err => {
            console.log(err);
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)

            if (selectedSubtitle && selectedSubtitle.subtitle && selectedSubtitle.subtitle.slideIndex === slideIndex && selectedSubtitle.subtitle.subslideIndex === subslideIndex) {
                dispatch(setSelectedSubtitle({ ...selectedSubtitle.subtitle }, selectedSubtitle.subtitleIndex));
            }
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideFailed(reason));
        })
}


export const splitSubslide = (slidePosition, subslidePosition, wordIndex, time) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState()[moduleName].article };
    requestAgent
    .post(Api.article.splitSubslide(article._id, slidePosition, subslidePosition), { wordIndex, time })
    .then((res) => {
        const { article } = res.body;
        dispatch(updateSubslideSuccess(article));
        dispatch(setArticle(article));
        dispatch(setSlidesToSubtitles(article.slides));
        dispatch(setSelectedSubtitle(null, null));

    })
    .catch(err => {

        const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
        NotificationService.responseError(err)
        dispatch(updateSubslideFailed(reason));
    })

}


export const addSubslide = (subslide) => (dispatch, getState) => {
    const article = { ...getState()[moduleName].article };
    const { slidePosition, subslidePosition } = subslide;
    requestAgent
        .post(Api.article.addSubslide(article._id, slidePosition, subslidePosition), subslide)
        .then((res) => {
            const { article } = res.body;
            dispatch(updateSubslideSuccess(article));
            dispatch(setSlidesToSubtitles(article.slides));

        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err);
            dispatch(updateSubslideFailed(reason));
        })
}


export const deleteSubslide = (slidePosition, subslidePosition) => (dispatch, getState) => {
    dispatch(updateSubslideLoading());
    const article = { ...getState()[moduleName].article };
    requestAgent
        .delete(Api.article.deleteSubslide(article._id, slidePosition, subslidePosition))
        .then((res) => {
            const { article } = res.body;
            dispatch(setSlidesToSubtitles(article.slides));
            dispatch(updateSubslideSuccess(article));
            dispatch(setSelectedSubtitle(null, null));
        })
        .catch(err => {
            const reason = err.response && err.response.text ? err.response.text : 'Something went wrong';
            NotificationService.responseError(err)
            dispatch(updateSubslideFailed(reason));
        })
}


export const updateSpeakers = speakersProfile => (dispatch, getState) => {
    const article = { ...getState()[moduleName].article };
    requestAgent
        .put(Api.article.updateSpeakers(article._id), { speakersProfile })
        .then((res) => {
            article.speakersProfile = speakersProfile;
            dispatch(setArticle(article));
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}


export const findAndReplaceText = (find, replace) => (dispatch, getState) => {
    const article = { ...getState()[moduleName].article };

    requestAgent
        .post(Api.article.findAndReplaceText(article._id), { find, replace })
        .then((res) => {
            dispatch(fetchArticleByVideoId(article.video))
        })
        .catch((err) => {
            console.log(err);
            NotificationService.responseError(err);
        })
}