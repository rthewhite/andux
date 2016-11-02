import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { applyMiddleware, createStore, Middleware, Reducer, Store, compose } from 'redux';

import { Action } from './actions';
import { loggerMiddleware } from './middlewares';


interface pathListener {
  previousValue: any;
  listeners: Array<Observable<any>>;
}


export class AnduxStore {
  private store: Store<any>;
  private pathListeners = {};

  constructor(
    rootReducer: Reducer<Function>,
    initialState: any,
    middlewares: Array<Middleware> = [],
    enableDebugging = false
  ) {

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
  observe(path: string) {
    const subscription = Observable.create((observer: Observer<any>) => {
      const currentValue = this.getValueForPath(path);

      // Pass the initial value
      observer.next(currentValue);

      // Register for future changes
      if (this.pathListeners[path]) {
        this.pathListeners[path].listeners.push(observer);
      } else {
        this.pathListeners[path] = {
          previousValue: currentValue,
          listeners: [observer]
        };
      }

      // Unsubscribe/cleanup
      return () => {
        if (this.pathListeners[path].listeners.length === 1) {
          delete this.pathListeners[path];
        } else {
          const index = this.pathListeners[path].listeners.indexOf(observer);
          this.pathListeners[path].listeners.slice(index, 1);
        }
      };
    });

    return subscription;
  }

  // Notifies observers if their value in the store has been changed
  private notifyObservers() {
    for (const key of Object.keys(this.pathListeners)) {
      if (this.pathListeners.hasOwnProperty(key)) {
        const currentValue = this.getValueForPath(key);
        const previousValue = this.pathListeners[key].previousValue;

        if (currentValue !== previousValue) {
          const listeners = this.pathListeners[key].listeners;
          for (let i = 0, len = listeners.length; i < len; i++) {
            listeners[i].next(currentValue);
          }
        };

        this.pathListeners[key].previousValue = currentValue;
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
