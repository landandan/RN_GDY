/**
 * @flow
 */
import { applyMiddleware } from 'redux'
import CryptoJS from 'crypto-js'
import stringify from 'json-stringify-safe'
import Alert from './Alert'
import { startLoading, finishLoading } from '../actions/loading'

function thunkState({ dispatch, getState }) {
  return next => action => {
    if (action && typeof action === 'function') {
      return dispatch(action(getState()))
    }
    return next(action)
  }
}

function promise({ dispatch }) {
  return next => action => {
    if (action && typeof action.then === 'function') {
      dispatch(startLoading())
      const finishLoadingAndDispatch = (input) => {
        dispatch(finishLoading())
        dispatch(input)
      }
      return action.then(finishLoadingAndDispatch).catch(finishLoadingAndDispatch)
    }
    return next(action)
  }
}

function multiDispatcher({ dispatch }) {
  return next => actions => {
    if (Array.isArray(actions)) {
      return actions.map(action => dispatch(action))
    }
    return next(actions)
  }
}

function errorHandler({ dispatch, getState }) {
  return next => action => {
    if (action instanceof Error) {
      const chinesePatten = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
      const msg = action.message || ''
      const { user = {}, flyDoveTransmission = {} } = getState() || {}
      const { userSessionInfo } = user
      //const isShowError = isFlyDoveTransmissionFlow({ flyDoveTransmission }) && userSessionInfo
      const showSignError = msg.indexOf('SignatureObj') !== -1
      if (__DEV__) {
        Alert.alert('', [msg, '\npos:{ line:', action.line, ',col:', action.column, ' }'].join(''))
      } else if (chinesePatten.test(msg)  || showSignError) {
        Alert.alert('', msg)
      }
      return action
    }

    try {
      return next(action)
    } catch (error) {
      return dispatch(error)
    }
  }
}

function logTracker({ getState }) {
  const actionBuffer = []
  const key = 'RC@Qv!gw6hW8Yc0z'
  global.ErrorUtils.setGlobalHandler(() => {
    const log = stringify({
      actionBuffer,
      state: getState(),
    })
  })
  return next => action => {
    const actionItem = {}
    actionItem.action = action
    actionItem.time = new Date()
    actionBuffer.push(actionItem)
    if (actionBuffer.length > 20) {
      actionBuffer.shift()
    }
    return next(action)
  }
}

const filterNil = () => (next) => (action) => {
  if (action != null) {
    next(action)
  }
}

export default applyMiddleware(
  multiDispatcher,
  errorHandler,
  promise,
  thunkState,
  filterNil,
  logTracker,
)
