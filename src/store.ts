import { AnduxReducer } from './reducers/reducer';
import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { applyMiddleware, createStore, Middleware, Reducer, Store, compose, combineReducers } from 'redux';
import { convertActionTypeToMethodName } from './utils';

import { Action } from './actions';
import { loggerMiddleware } from './middlewares';

export class AnduxStore {
  private store: Store<any>;
  private subjects = {};

  constructor(
    reducers: any,
    middlewares: Array<Middleware> = [],
    enableDebugging = false
  ) {
    const initialState = {};
    const reducerMethods = {};

    // Lets get the data needed from the reducers and create the initialState
    for (const key in reducers) {
      if (reducers.hasOwnProperty(key)) {
        const Reducer = reducers[key];

        Object.defineProperty(Reducer.prototype, `reduce`, {
          value: function(state?: Map<string, any>, action?: any) {
            if (action && state) {
              // Convert the action type to method name
              // example:  API_CALL_LOAD_STARTED > apiCallLoadStarted
              const methodName = convertActionTypeToMethodName(action.type);

              // Check if a handler for this action is defined and execute
              if (this[methodName]) {
                state = this[methodName](state, action);
              }

              // Apply tranformers
              if (this['_transformers'] && this['_transformers'].length > 0) {
                this['_transformers'].forEach(transformer => {
                  state = transformer.transform(state, action);
                });
              }
            }

            // If we are doing nothing, return the state or initialState if no state is given
            return state || this.initialState;
          },
          writable: true
        });


        const reducer = new reducers[key]();

        // Reducer must have a key
        if (!reducer.key) {
          throw new Error('[andux] Missing key on reducer');
        }

        // Reducer must have a initialState
        if (!reducer.initialState) {
          throw new Error('[andux] Missing initialState on reducer');
        }

        initialState[reducer.key] = reducer.initialState;
        reducerMethods[reducer.key] = reducer['reduce'].bind(reducer);
      }
    }

    // Let's create the root reducer
    const rootReducer = combineReducers(reducerMethods);

    // Setup the ReduxStore
    if (enableDebugging) {
      this.store = createStore(rootReducer, initialState, compose(
        applyMiddleware(...middlewares, thunk, loggerMiddleware),
        window['devToolsExtension'] ? window['devToolsExtension']() : f => f
      ));
    } else {
      this.store = createStore(rootReducer, initialState, applyMiddleware(...middlewares, thunk));
    }

    // Subscribe to changes on the store and notify observers
    this.store.subscribe(() => {
      this.notifyObservers();
    });
  }

  get state(): any {
    return this.store.getState();
  }

  getState(): any {
    return this.store.getState();
  }

  dispatch(action: Action | Observable<any> | Function ): any {
    return this.store.dispatch(<Action>action);
  }

  subscribe(listener: Function): Function {
    return this.store.subscribe(() => listener(this.getState()));
  }

  // Returns an observable that notifies on changes for
  // the given path
  observe(path: string): BehaviorSubject<any> {
    if (!this.subjects[path]) {
      const currentValue = this.getValueForPath(path);
      const subject = new BehaviorSubject(currentValue);

      this.subjects[path] = subject;
    }

    return this.subjects[path];
  }

  // Notifies observers if their value in the store has been changed
  private notifyObservers() {
    for (const path of Object.keys(this.subjects)) {
      const subject: BehaviorSubject<any> = this.subjects[path];
      const previousValue = subject.getValue();
      const currentValue = this.getValueForPath(path);

      if (currentValue !== previousValue) {
        subject.next(currentValue);
      }
    }
  }

  // Retrieves the value for the given path in the store
  // example:  somereducer.foo.bar
  private getValueForPath(path: string) {
    const splittedPath = path.split('.');
    const reducer = splittedPath[0];
    return this.getState()[reducer].getIn(splittedPath.slice(1)) ;
  }
}
