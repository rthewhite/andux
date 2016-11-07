import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { applyMiddleware, createStore, Middleware, Reducer, Store, compose } from 'redux';

import { Action } from './actions';
import { loggerMiddleware } from './middlewares';

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
  observe(path: string): Observable<any> {
    const subscription = Observable.create((observer: Observer<any>) => {
      const currentValue = this.getValueForPath(path);

      // Register for future changes
      if (this.pathListeners[path]) {
        this.pathListeners[path].push({
          previousValue: currentValue,
          observer
        });
      } else {
        this.pathListeners[path] = [{
          previousValue: currentValue,
          observer
        }];
      }

      let indexOfListener = this.pathListeners[path].length - 1;

      // Pass the initial value
      observer.next(currentValue);

      // Unsubscribe/cleanup
      return () => {
        if (this.pathListeners[path].length === 1) {
          delete this.pathListeners[path];
        } else {
          this.pathListeners[path].splice(indexOfListener, 1);
        }
      };
    });

    return subscription;
  }

  // Notifies observers if their value in the store has been changed
  private notifyObservers() {
    for (const path of Object.keys(this.pathListeners)) {
      if (this.pathListeners.hasOwnProperty(path)) {
        for (let i = 0, len = this.pathListeners[path].length; i < len; i++) {
          const observer = this.pathListeners[path][i].observer;
          const currentValue = this.getValueForPath(path);
          const previousValue = this.pathListeners[path][i].previousValue;

          if (currentValue !== previousValue) {
            this.pathListeners[path][i].previousValue = currentValue;
            observer.next(currentValue);
          };
        }
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
