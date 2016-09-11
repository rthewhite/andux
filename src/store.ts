import { createStore } from 'redux';

export class Store {
  constructor(rootReducer: Function, initialState: any, middlewares: Array<Function> = []) {
    if (!rootReducer) {
      throw new Error('No rootReducer passed');
    }

    if (!initialState) {
      throw new Error('No initialState passed');
    }
  }
}