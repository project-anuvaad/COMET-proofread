import { createBrowserHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import reduxThunk from 'redux-thunk'


import createRootReducer from './reducers'


function configureStore(rootReducer, initialState, middlewares = {}) {

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(middlewares),
  )

  return { store }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const history = createBrowserHistory();

const middlewares = process.env.NODE_ENV === 'development'
  ? applyMiddleware(reduxThunk, createLogger())
  : applyMiddleware(reduxThunk)

    
const rootReducer = createRootReducer()

const { store } = configureStore(rootReducer, {}, middlewares)

export {
  store,
  history,
}
