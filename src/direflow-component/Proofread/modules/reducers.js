import * as actionTypes from './types';

const INITIAL_STATE = {
    user: null,
    organization: null,
    video: null,
    updateLoading: false,
    organizationVideos: {
        status: 'done',
        videosList: [],
        tabs: [],
        activeTabIndex: 0,
    },
    fetchVideoState: 'done',
    fetchVideoError: '',

    uploadProgress: 0,
    uploadState: 'done',
    uploadError: '',
    convertStages: {
        stages: [],
        activeStageIndex: null,
    },
    uploadVideoForm: {
        title: '',
        numberOfSpeakers: 1,
        langCode: 'en-US',
        video: null,
        backgroundMusic: null,
        fileContent: null,
        withSubtitle: false,
        subtitle: null,
        mode: 'view',
        videos: [],
        subtitles: [],
        activeTabIndex: 0,
    },


    article: null,
    fetchArticleState: 'done',
    fetchArticleError: '',
    updateSubslideState: 'done',
    subtitles: [],
    selectedSubtitle: {
        subtitle: null,
        subtitleIndex: null,
    },
    transcriptionVersions: [],
    toEnglish: false,
    nameSlides: false,
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case actionTypes.SET_USER_DATA:
            return { ...state, user: action.payload };
        case actionTypes.SET_ORGANIZATION_DATA:
            return { ...state, organization: action.payload };
        case actionTypes.FETCH_VIDEO_LOADING:
            return { ...state, fetchVideoState: 'loading', video: null };
        case actionTypes.FETCH_VIDEO_SUCCESS:
            return { ...state, fetchVideoState: 'done', video: action.payload };
        case actionTypes.FETCH_VIDEO_FAILED:
            return { ...state, fetchVideoState: 'failed', fetchVideoError: action.payload };
        case actionTypes.SET_UPDATE_LOADING:
            return { ...state, updateLoading: action.payload };
        case actionTypes.SET_STAGES:
            return { ...state, convertStages: action.payload };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_LOADING:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'loading ' } };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_FAILED:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'failed ' } };
        case actionTypes.FETCH_ORGANIZATION_VIDEOS_SUCCESS:
            return { ...state, organizationVideos: { ...state.organizationVideos, status: 'done', videosList: action.payload } };
        case actionTypes.SET_ORGANIZATION_VIDEOS_ACTIVE_TAB_INDEX:
            return { ...state, organizationVideos: { ...state.organizationVideos, activeTabIndex: action.payload } };
        case actionTypes.SET_ORGANIZATION_VIDEOS_TABS:
            return { ...state, organizationVideos: { ...state.organizationVideos, tabs: action.payload } };
        case actionTypes.SET_UPLOAD_VIDEO_FORM:
            return { ...state, uploadVideoForm: action.payload };
        case actionTypes.RESET_UPLOAD_VIDEO_FORM:
            return { ...state, uploadVideoForm: { ...INITIAL_STATE.uploadVideoForm } };
        case actionTypes.FETCH_ARTICLE_LOADING:
            return { ...state, fetchArticleState: 'loading', fetchArticleError: '', article: null };
        case actionTypes.FETCH_ARTICLE_FAILED:
            return { ...state, fetchArticleState: 'failed', fetchArticleError: action.payload };
        case actionTypes.FETCH_ARTICLE_SUCCESS:
            return { ...state, fetchArticleState: 'done', article: action.payload };
        case actionTypes.SET_TRANSCRIPTION_VERSIONS:
            return { ...state, transcriptionVersions: action.payload };
        case actionTypes.UPDATE_SUBSLIDE_LOADING:
            return { ...state, updateSubslideState: 'loading' };
        case actionTypes.UPDATE_SUBSLIDE_FAILED:
            return { ...state, updateSubslideState: 'failed' };
        case actionTypes.UPDATE_SUBSLIDE_SUCCESS:
            return { ...state, updateSubslideState: 'done', article: action.payload };
        case actionTypes.SET_SUBTITLES:
            return { ...state, subtitles: action.payload };
        case actionTypes.SET_ARTICLE:
            return { ...state, article: action.payload };
        case actionTypes.SET_SELECTED_SUBTITLE:
            return { ...state, selectedSubtitle: action.payload };
        case actionTypes.SET_TO_ENGLISH:
            return { ...state, toEnglish: action.payload };
        case actionTypes.SET_NAME_SLIDES:
            return { ...state, nameSlides: action.payload };
        case actionTypes.RESET:
            return { ...INITIAL_STATE };
        default:
            return state;
    }
}