import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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
  observe(path: string): BehaviorSubject<any> {
    const currentValue = this.getValueForPath(path);
    const subject = new BehaviorSubject(currentValue);

    // Register for future changes
    if (this.pathListeners[path]) {
      this.pathListeners[path].push({
        previousValue: currentValue,
        subject
      });
    } else {
      this.pathListeners[path] = [{
        previousValue: currentValue,
        subject
      }];
    }

    return subject;
  }

  // Notifies observers if their value in the store has been changed
  private notifyObservers() {
    for (const path of Object.keys(this.pathListeners)) {
      if (this.pathListeners.hasOwnProperty(path)) {
        // Loop backwards so we can safely remove items when they have no
        // more observers
        for (let i = this.pathListeners[path].length - 1; i >= 0; i--) {
          const subject: BehaviorSubject<any> = this.pathListeners[path][i].subject;

          // Check if there are any observers, otherwise clean up
          if (subject.observers.length > 0) {
            const currentValue = this.getValueForPath(path);
            const previousValue = this.pathListeners[path][i].previousValue;

            if (currentValue !== previousValue) {
              this.pathListeners[path][i].previousValue = currentValue;
              subject.next(currentValue);
            };
          } else {
            if (this.pathListeners[path].length === 1) {
              delete this.pathListeners[path];
            } else {
              this.pathListeners[path].splice(i, 1);
            }
          }
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
