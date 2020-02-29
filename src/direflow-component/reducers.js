import { combineReducers } from 'redux'
import proofread from './Proofread/modules/reducers';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    proofread,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
