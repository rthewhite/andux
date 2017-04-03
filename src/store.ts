import thunk from 'redux-thunk';
import { Observer, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { applyMiddleware, createStore, Middleware, Reducer, Store, compose } from 'redux';

import { Action } from './actions';
import { loggerMiddleware } from './middlewares';

export class AnduxStore {
  private store: Store<any>;
  private subjects = {};

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
