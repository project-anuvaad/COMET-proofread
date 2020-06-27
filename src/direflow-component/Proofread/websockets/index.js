import io from 'socket.io-client';
import * as events from './events';

var pendingSubs = [];
const subs = {};

// setInterval(() => {
//   console.log('============================= EVNTS ===============================')
//   Object.keys(subs).forEach((key) => {
//     console.log(key, subs[key].length);
//   })
//   console.log(connection)
//   console.log('============================= EVNTS ===============================')
// }, 5000);

var connection;
const createWebsocketConnection = function createWebsocketConnection(url, options = {}) {
  connection = io.connect(url, options);
  if (pendingSubs.length > 0) {
    pendingSubs.forEach((sub) => {
      subscribeToEvent(sub.event, sub.callback)
    })
    pendingSubs = [];
  }
  return connection
}

const disconnectConnection = function disconnectConnection() {
  Object.keys(subs).forEach(key => {
    unsubscribeFromEvent(key);
  })
  if (connection) return connection.disconnect();
}

const emitEvent = function emitEvent(event, args) {
  return connection.emit(event, args);
}

const subscribeToEvent = function subscribeToEvent(event, callback) {
  if (connection) {
    if (subs[event]) {
      subs[event].push(callback)
    } else {
      subs[event] = [callback]
    }
    connection.off(event);
    console.log('============= ON =================', event)
    return connection.on(event, (...args) => {
      subs[event].forEach(s => {
        s(...args)
      })
    });
  } else {
    pendingSubs.push({ event, callback });
  }
}

const unsubscribeFromEvent = function unsubscribeFromEvent(event, listener) {
  if (connection) {
    if (subs[event] && listener) {
      const listenerIndex = subs[event].findIndex(s => s === listener);
      subs[event].splice(listenerIndex, 1);

    } else {
      delete subs[event];
    }
    if (!subs[event] || subs[event].length === 0) {
      console.log('======================= OFF ========================== ', event)
      return connection.off(event);
    }
  }
}

export default {
  createWebsocketConnection,
  disconnectConnection,
  emitEvent,
  subscribeToEvent,
  unsubscribeFromEvent,
  events,
}
