export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp', 'jif', 'jfif', 'jp2', 'jpx', 'j2k', 'j2c', 'fpx', 'pcd'];
export const VIDEOS_EXTESION = ['webm', 'mp4', 'ogg', 'ogv'];
export const GIF_EXTESIONS = ['gif'];
export const VIDEO_PLAYER_THUMBNAIL_IMAGE = '';
export const SPEAKER_BACKGROUND_COLORS = {
    [-1]: 'yellow',
    0: '#800080',
    1: '#0e7ceb',
    2: 'green',
    3: 'lightgray',
    4: 'orange',
    5: '#4c4c4c',
    6: '#9a0000',
    7: 'purple',
    8: '#038284',
    9: '#3e3e71',
    10: '#6435c9',
}

export const SPEAKER_TEXT_COLORS = {
    [-1]: 'black',
    0: 'white',
    1: 'white',
    2: 'white',
    3: 'black',
    4: 'white',
    5: 'white',
    6: 'white',
    7: 'white',
    8: 'white',
    9: 'white',
    10: 'white',
}


export const WEBSOCKET_SERVER_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://comet.anuvaad.org';
// export const API_ROOT = window.localStorage.getItem(LOCALSTORAGE_API_ROOT_KEY)
export const LOCALSTORAGE_API_KEY_KEY = 'vw-x-user-api-key'
export const LOCALSTORAGE_API_ROOT_KEY = 'vw-api-root';