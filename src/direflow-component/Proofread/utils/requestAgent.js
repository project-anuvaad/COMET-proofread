import { LOCALSTORAGE_API_KEY_KEY } from '../constants';

// import { store } from '../../store';
const request = require('superagent-use')(require('superagent'));


request.use((req) => {
  const token = window.localStorage.getItem(LOCALSTORAGE_API_KEY_KEY);
  if (token) {
    req.header[LOCALSTORAGE_API_KEY_KEY] = token;
  }

  return req;
});

export default request;
