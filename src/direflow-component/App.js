import React from 'react'
import { Provider } from 'react-redux'

import { store } from './store'

import Proofread from './Proofread'

import { LOCALSTORAGE_API_ROOT_KEY, LOCALSTORAGE_API_KEY_KEY } from './Proofread/constants';
import { NotificationContainer } from 'react-notifications';

class App extends React.Component {

  componentWillMount = () => {
    // Set the API KEY to the local storage
    window.localStorage.setItem(LOCALSTORAGE_API_KEY_KEY, this.props.apiKey)
    window.localStorage.setItem(LOCALSTORAGE_API_ROOT_KEY, this.props.apiRoot)
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.apiKey !== this.props.apiKey) {
      window.localStorage.setItem(LOCALSTORAGE_API_KEY_KEY, this.props.apiKey)
    }
    if (nextProps.apiRoot !== this.props.apiRoot) {
      window.localStorage.setItem(LOCALSTORAGE_API_ROOT_KEY, this.props.apiRoot)
    }
  }

  render() {
    if (!this.props.apiKey || !this.props.apiRoot) return null;
    return (

      <Provider store={store} >
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />

        <Proofread
          {...this.props}
        />
        <NotificationContainer />
      </Provider>
    )
  }
}

export default (App);
