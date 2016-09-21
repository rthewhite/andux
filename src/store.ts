import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { applyMiddleware, createStore, Middleware, Reducer, Store, compose } from 'redux';

import { Action } from './actions';
import { loggerMiddleware } from './middlewares';

export class AnduxStore {
  private store: Store<any>;
  private subscribers = new Map();

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

  getState(): any {
    return this.store.getState();
  }

  dispatch(action: Action): any {
    return this.store.dispatch(action);
  }

  subscribe(listener: Function): Function {
    return this.store.subscribe(() => listener(this.getState()));
  }

  // Returns an observable that notifies on changes for
  // the given path
  observe(path: string) {
    const currentValue = this.getValueForPath(path);

    const subscription = Observable.create((observer: Observer<any>) => {
      // Pass the initial value
      observer.next(currentValue);

      // Register for changes
      this.subscribers.set(observer, {
        path: path,
        previousValue: currentValue
      });

      // Unsubscribe/cleanup
      return () => {
        this.subscribers.delete(observer);
      };
    });

    return subscription;
  }

  // Notifies observers if their value in the store has been changed
  private notifyObservers() {
    this.subscribers.forEach((options, observer) => {
      const currentValue = this.getValueForPath(options.path);

      if (currentValue !== options.previousValue) {
        observer.next(currentValue);
        options.previousValue = currentValue;
        this.subscribers.set(observer, options);
      }
    });
  }

  // Retrieves the value for the given path in the store
  // example:  somereducer.foo.bar
  private getValueForPath(path: string) {
    const splittedPath = path.split('.');
    const reducer = splittedPath[0];
    const value = this.getState()[reducer].getIn(splittedPath.slice(1)) ;

    return value;
  }
}
