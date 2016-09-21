import { expect } from 'chai';
import { Subject } from 'rxjs';

import { Action } from './action';
import { ObservableAction } from './observable-action';

let actions;
let observable: Subject<any>;

class FoobarActions {

  @ObservableAction()
  someAction(foo) {
    return observable;
  }
}

describe('ObservableAction', () => {
  beforeEach(() => {
    actions = new FoobarActions();
    observable = new Subject();
  });

  it('should call dispatch with an started actionType', (done) => {
    const someAction = actions.someAction('foobar');

    someAction((action: Action) => {
      expect(action.type).to.equal('SOME_ACTION_STARTED');
      done();
    });
  });

  it('should call dispatch with an succes actionType when the observable returns success', done => {
    const someAction = actions.someAction('foobar');
    let counter = 0;

    someAction((action: Action) => {
      counter += 1;

      if (counter === 2) {
        expect(action.type).to.equal('SOME_ACTION_SUCCESS');
        expect(action.payload.request[0]).to.equal('foobar');
        expect(action.payload.response).to.equal('foobar-success');
        done();
      }
    });

    observable.next('foobar-success');
  });

  it('should call dispatch with an error actionType when the observable returns error', done => {
    let counter = 0;
    const someAction = actions.someAction('foobar');

    someAction((action: Action) => {
      counter += 1;

      if (counter === 2) {
        expect(action.type).to.equal('SOME_ACTION_FAILED');
        expect(action.payload.request[0]).to.equal('foobar');
        expect(action.payload.response).to.equal('foobar-error');
        done();
      }
    });

    observable.error('foobar-error');
  });

  it('should call dispatch with an completed actionType when the observable completes', done => {
    let counter = 0;
    const someAction = actions.someAction('foobar');

    someAction((action: Action) => {
      counter += 1;

      if (counter === 2) {
        expect(action.type).to.equal('SOME_ACTION_COMPLETED');
        expect(action.payload.request[0]).to.equal('foobar');
        done();
      }
    });
    observable.complete();
  });
});
