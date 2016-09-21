import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai  from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import { Map } from 'immutable';
import { combineReducers } from 'redux';
import { Observable } from 'rxjs';
import { AnduxStore } from './store';

describe('Store', () => {
  describe('getState', () => {
    it('Store should have a getState method', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      expect(store.getState).exist;
    });

    it('Calling getState should return the state', () => {
      const reducer = (state, action) => { return state; };
      const initialState = Map({ foo: 'bar'});
      const store = new AnduxStore(reducer, initialState);

      expect(store.getState()).to.equal(initialState);
    });
  });

  describe('dispatch', () => {
    it('Store should have a dispatch method', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      expect(store.dispatch).to.exist;
    });

    it('Calling dispatch should dispatch the given action to the reducer', () => {
      let reducerCalled = false;
      const actionType = 'CHANGE_FOO';

      const reducer = (state, action) => {
        if (action.type === actionType) {
          reducerCalled = true;
          state = state.set('foo', 'foo');
        }
        return state;
      };
      const initialState = Map({ foo: 'bar'});
      const store = new AnduxStore(reducer, initialState);

      expect(store.getState().get('foo')).to.equal('bar');

      store.dispatch({type: actionType});

      expect(reducerCalled).to.equal(true);
      expect(store.getState().get('foo')).to.equal('foo');
    });
  });

  describe('subscribe', () => {
    it('Store should have an subscribe method', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      expect(store.subscribe).to.exist;
    });

    it('Subscribers should be notified of any change in the store', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      const spy = sinon.spy();

      store.subscribe(spy);
      expect(spy).to.not.have.been.called;

      store.dispatch({type: 'FOOBAR'});
      expect(spy).to.have.been.calledOnce;

      store.dispatch({type: 'FOOBAR'});
      expect(spy).to.have.been.calledTwice;
    });

    it('Subscribe should return an unsubscribe function', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      const spy = sinon.spy();

      const unsubscribe = store.subscribe(spy);
      expect(unsubscribe).to.be.a('function');

      store.dispatch({ type: 'FOOBAR' });
      expect(spy).to.have.been.calledOnce;

      unsubscribe();

      store.dispatch({type: 'FOOBAR'});
      expect(spy).to.have.been.calledOnce;
    });
  });

  describe('observe', () => {
    it('Store should have an observe method', () => {
      const store = new AnduxStore((state, action) => { return state; }, {});
      expect(store.observe).to.exist;
    });

    it('Observe should return an observable', () => {
      const fooState = Map({foo: 'bar'});
      const fooReducer = (state, action) => { return state || fooState ; };

      const initialState = {
        foo: fooState
      };

      const rootReducer = combineReducers<any>({
        foo: fooReducer
      });

      const store = new AnduxStore(rootReducer, initialState);
      const observable = store.observe('foo.bar');

      expect(observable instanceof Observable).to.equal(true);
    });

    it('Observable should return the initial value when starting to observe', () => {
      const fooState = Map({foo: 'bar'});
      const fooReducer = (state, action) => { return state || fooState ; };

      const initialState = {
        foo: fooState
      };

      const rootReducer = combineReducers<any>({
        foo: fooReducer
      });

      const store = new AnduxStore(rootReducer, initialState);
      const observable = store.observe('foo.foo');

      let result;

      observable.subscribe(foo => {
        result = foo;
      });

      expect(result).to.equal('bar');
    });

    it('Observable should only trigger when the observed value changes', () => {
      const fooState = Map({foo: 'bar', bar: 'foo'});
      const fooReducer = (state, action) => {
        if (action.type === 'CHANGE_BAR') {
          state = state.set('bar', 'bar was changed');
        } else if (action.type === 'CHANGE_FOO') {
          state = state.set('foo', 'foo was changed');
        }

        return state || fooState;
      };

      const initialState = {
        foo: fooState
      };

      const rootReducer = combineReducers<any>({
        foo: fooReducer
      });

      const store = new AnduxStore(rootReducer, initialState);
      const observable = store.observe('foo.foo');
      const spy = sinon.spy();

      observable.subscribe(spy);

      // Called the first time with the initial value
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith('bar');

      // This action should only change the bar value and not foo
      store.dispatch({
        type: 'CHANGE_BAR'
      });

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith('bar');

      // Fire an action that should change foo, the observable should be notified
      store.dispatch({
        type: 'CHANGE_FOO'
      });

      expect(spy).to.have.been.calledTwice;
      expect(spy).to.have.been.calledWith('foo was changed');
    });

    it('Should be able to unsubscribe', () => {
      const fooState = Map({foo: 'bar', bar: 'foo'});
      const fooReducer = (state, action) => {
        if (action.type === 'CHANGE_FOO') {
          state = state.set('foo', action.payload);
        }

        return state || fooState;
      };

      const initialState = {
        foo: fooState
      };

      const rootReducer = combineReducers<any>({
        foo: fooReducer
      });

      const store = new AnduxStore(rootReducer, initialState);
      const observable = store.observe('foo.foo');
      const spy = sinon.spy();

      const subscription = observable.subscribe(spy);

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith('bar');

      // Unsubscribe
      subscription.unsubscribe();

      // We unsubscribed this action should have no effect
      store.dispatch({
        type: 'CHANGE_FOO',
        payload: 'bar 2'
      });

      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith('bar');
    });
  });
});
