import querystring from 'query-string';
import { LOCALSTORAGE_API_ROOT_KEY } from '../constants';

let apiRoot = '';
function getApiRoot() {
    if (apiRoot) return apiRoot;
    apiRoot = window.localStorage.getItem(LOCALSTORAGE_API_ROOT_KEY);
    return apiRoot;
}

export default {
    video: {
        getVideoById: (id) => `${getApiRoot()}/video/${id}`,
        updateVideoById: (id) => `${getApiRoot()}/video/${id}`,
        deleteById: (id) => `${getApiRoot()}/video/${id}`,
        convertVideo: (id) => `${getApiRoot()}/video/${id}/convert`,
        getVideos: (params = {}) => `${getApiRoot()}/video?${querystring.encode(params)}`,
        getVideosCount: (params = {}) => `${getApiRoot()}/video/count?${querystring.encode(params)}`,
        getOrganizationVideos: (id) => `${getApiRoot()}/video?organization=${id}`,
        transcribeVideo: id => `${getApiRoot()}/video/${id}/transcribe`,
        skipTranscribe: id => `${getApiRoot()}/video/${id}/transcribe/skip`,
        uploadBackgroundMusic: id => `${getApiRoot()}/video/${id}/backgroundMusic`,
        deleteBackgroundMusic: id => `${getApiRoot()}/video/${id}/backgroundMusic`,
        extractVideoBackgroundMusic: id => `${getApiRoot()}/video/${id}/backgroundMusic/extract`,
        updateReviewers: id => `${getApiRoot()}/video/${id}/reviewers`,
        updateVerifiers: id => `${getApiRoot()}/video/${id}/verifiers`,
        refreshMedia: (id) => `${getApiRoot()}/video/${id}/refreshMedia`,
    },
    noiseCancellationVideos: {
        getVideos: (params = {}) => `${getApiRoot()}/noiseCancellationVideo?${querystring.encode(params)}`,
        uploadVideo: () => `${getApiRoot()}/noiseCancellationVideo`,
    },
    article: {
        getById: id => `${getApiRoot()}/article/${id}`,
        deleteById: id => `${getApiRoot()}/article/${id}`,
        getbyVideoId: id => `${getApiRoot()}/article/by_video_id?videoId=${id}`,
        updateSubslide: (articleId, slidePosition, subslidePosition) => `${getApiRoot()}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        splitSubslide: (articleId, slidePosition, subslidePosition) => `${getApiRoot()}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}/split`,
        addSubslide: (articleId, slidePosition, subslidePosition) => `${getApiRoot()}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        deleteSubslide: (articleId, slidePosition, subslidePosition) => `${getApiRoot()}/article/${articleId}/slides/${slidePosition}/content/${subslidePosition}`,
        updateSpeakers: (articleId) => `${getApiRoot()}/article/${articleId}/speakersProfile`,
        updateToEnglish: (articleId) => `${getApiRoot()}/article/${articleId}/toEnglish`,
        markVideoAsDone: (articleId) => `${getApiRoot()}/article/${articleId}/reviewCompleted`,
        updateTranslators: (articleId) => `${getApiRoot()}/article/${articleId}/translators`,
        updateTranslatorsFinishDate: (articleId) => `${getApiRoot()}/article/${articleId}/translators/finishDate`,
        updateVerifiers: (articleId) => `${getApiRoot()}/article/${articleId}/verifiers`,
        updateVolume: (articleId) => `${getApiRoot()}/article/${articleId}/volume`,
        updateNormalizeAudio: (articleId) => `${getApiRoot()}/article/${articleId}/normalizeAudio`,
        getTranslatedArticles: (params) => `${getApiRoot()}/article/translations?${querystring.encode(params)}`,
        getUserTranslations: (params) => `${getApiRoot()}/article/translations/by_user?${querystring.encode(params)}`,
        findAndReplaceText: (articleId) => `${getApiRoot()}/article/${articleId}/text/replace`,

    },
    comments: {
        getCommentsByArticleId: (articleId, params) => `${getApiRoot()}/article/${articleId}/comments?${querystring.encode(params)}`,
        addComment: () => `${getApiRoot()}/comment`,
    },
    translate: {
        getTranslatableArticle: (articleId, params) => `${getApiRoot()}/translate/${articleId}?${querystring.encode(params)}`,
        getTranslatableArticleBaseLanguages: (articleId) => `${getApiRoot()}/translate/${articleId}/languages`,
        generateTranslatableArticle: (originalArticleId) => `${getApiRoot()}/translate/${originalArticleId}`,
        addTranslatedText: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/text`,
        findAndReplaceText: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/text/replace`,
        addRecordedTranslation: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/audio`,
        addTTSTranslation: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/audio/tts`,
        updateAudioFromOriginal: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/audio/original`,
        deleteRecordedTranslation: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/audio`,
        updateVideoSpeed: (translateableArticleId) => `${getApiRoot()}/translate/${translateableArticleId}/videoSpeed`,
    },
    translationExport: {
        getByArticleId: (articleId, params) => `${getApiRoot()}/translationExport/by_article_id/${articleId}?${querystring.encode(params)}`,
        generateAudioArchive: (translationExportId) => `${getApiRoot()}/translationExport/${translationExportId}/audios/generateArchive`,
        generateSubtitledVideo: (translationExportId) => `${getApiRoot()}/translationExport/${translationExportId}/video/burnSubtitles`,
        generateSubtitles: (translationExportId) => `${getApiRoot()}/translationExport/${translationExportId}/video/subtitles`,
        requestExportTranslationReview: () => `${getApiRoot()}/translationExport/requestExport`,
        approveExportTranslation: (id) => `${getApiRoot()}/translationExport/${id}/approve`,
        declineeExportTranslation: (id) => `${getApiRoot()}/translationExport/${id}/decline`,
        updateAudioSettings: (id) => `${getApiRoot()}/translationExport/${id}/audioSettings`,
    },
    organization: {
        getOrganizationById: (id) => `${getApiRoot()}/organization/${id}`,
        createOrganization: () => `${getApiRoot()}/organization`,
        updateLogo: (orgId) => `${getApiRoot()}/organization/${orgId}/logo`,
        getUsers: (params) => `${getApiRoot()}/user/getOrgUsers?${querystring.encode(params)}`,
        inviteUser: (organizationId) => `${getApiRoot()}/organization/${organizationId}/users`,
        removeUser: (organizationId, userId) => `${getApiRoot()}/organization/${organizationId}/users/${userId}`,
        editPermissions: (organizationId, userId) => `${getApiRoot()}/organization/${organizationId}/users/${userId}/permissions`,
        respondToOrganizationInvitation: (organizationId) => `${getApiRoot()}/organization/${organizationId}/invitations/respond`,
    },
    user: {
        subscribeToApiDocs: () => `${getApiRoot()}/user/subscribe_api_docs`,
        resetPassword: () => `${getApiRoot()}/user/resetPassword`,
        getUserDetails: () => `${getApiRoot()}/user/getUserDetails`,
        updatePassword: (userId) => `${getApiRoot()}/user/${userId}/password`,
    },
    invitations: {
        respondToOrganizationInvitation: (organizationId) => `${getApiRoot()}/invitations/organization/${organizationId}/invitations/respond`,
        respondToTranslationInvitation: (articleId) => `${getApiRoot()}/invitations/article/${articleId}/translators/invitation/respond`
    },
    notification: {
        getNotifications: (params) => `${getApiRoot()}/notification?${querystring.encode(params)}`,
        setNotificationsRead: (params) => `${getApiRoot()}/notification/read?${querystring.encode(params)}`,
        getUnreadCount: (params) => `${getApiRoot()}/notification/unread/count?${querystring.encode(params)}`
    },
    subtitles: {
        getById: id => `${getApiRoot()}/subtitles/${id}`,
        getByArticleId: id => `${getApiRoot()}/subtitles/by_article_id/${id}`,
        updateSubtitle: (id, subtitlePosition) => `${getApiRoot()}/subtitles/${id}/subtitles/${subtitlePosition}`,
        activateSubtitle: (id) => `${getApiRoot()}/subtitles/${id}/activated`,
        addSubtitle: (id) => `${getApiRoot()}/subtitles/${id}/subtitles`,
        deleteSubtitle: (id, subtitlePosition) => `${getApiRoot()}/subtitles/${id}/subtitles/${subtitlePosition}`,
        resetSubtitles: (id) => `${getApiRoot()}/subtitles/${id}/reset`,
        splitSubtitle: (id, subtitlePosition) => `${getApiRoot()}/subtitles/${id}/subtitles/${subtitlePosition}/split`,
        combineSubtitles: (id) => `${getApiRoot()}/subtitles/${id}/subtitles/combine`,
    },
    apiKeys: {
        get: (params) => `${getApiRoot()}/apiKey?${querystring.encode(params)}`,
        getByKey: (apiKey) => `${getApiRoot()}/apiKey/by_key?apiKey=${apiKey}`,
        create: () => `${getApiRoot()}/apiKey`,
        delete: (id) => `${getApiRoot()}/apiKey/${id}`,
    }
}