import * as reduxLogger from 'redux-logger';
import { Middleware } from 'redux';
import { Iterable } from 'immutable';

// State tranformer changes Immutable objects to plain objects for convience
export const stateTransformer = state => {
  let newState = {};

  for (let i of Object.keys(state)) {
    if (Iterable.isIterable(state[i])) {
      newState[i] = state[i].toJS();
    } else {
      newState[i] = state[i];
    }
  };

  return newState;
};

export const loggerMiddleware: Middleware = reduxLogger({
  collapsed: true,
  stateTransformer
});

