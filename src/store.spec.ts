import { AnduxReducer } from './reducers/reducer';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai  from 'sinon-chai';

const expect = chai.expect;
chai.use(sinonChai);

import { Map, List } from 'immutable';
// import { combineReducers } from 'redux';
import { Observable } from 'rxjs/Observable';
import { AnduxStore } from './store';

class ReducerOne extends AnduxReducer {
  public key = 'reducerOne';
  public initialState = Map({
    test: 'foobar1'
  });
}

class ReducerTwo extends AnduxReducer {
  public key = 'reducerTwo';
  public initialState = Map({
    test: 'foobar2'
  });
}

const reducers = {
  reducerOne: ReducerOne,
  reducerTwo: ReducerTwo
};


describe('Store', () => {
  describe('constructor', () => {
    it('Should initialize reducers and initialState successfully', () => {
      const store = new AnduxStore(reducers, [], false);

      expect(store.getState().reducerOne).exist;
      expect(store.getState().reducerTwo).exist;

      expect(store.getState().reducerOne.get('test')).to.equal('foobar1');
      expect(store.getState().reducerTwo.get('test')).to.equal('foobar2');
    });
  });

  describe('dispatch', () => {
    it('Store should have a dispatch method', () => {
      const store = new AnduxStore(reducers, []);
      expect(store.dispatch).to.exist;
    });

    it('Calling dispatch should dispatch the given action to the reducer', () => {
      let reducerCalled = false;

      class TestReducer extends AnduxReducer {
        public key = 'test';
        public initialState = Map({
          foo: 'bar'
        });

        changeFoo(state, action) {
          reducerCalled = true;
          return state.set('foo', 'foo');
        }
      }

      const store = new AnduxStore({
        test: TestReducer
      });

      expect(store.getState().test.get('foo')).to.equal('bar');

      store.dispatch({
        type: 'CHANGE_FOO'
      });

      expect(reducerCalled).to.equal(true);
      expect(store.getState().test.get('foo')).to.equal('foo');
    });
  });

  describe('subscribe', () => {
    it('Store should have an subscribe method', () => {
      const store = new AnduxStore(reducers);
      expect(store.subscribe).to.exist;
    });

    it('Subscribers should be notified of any change in the store', () => {
      const store = new AnduxStore(reducers);
      const spy = sinon.spy();

      store.subscribe(spy);
      expect(spy).to.not.have.been.called;

      store.dispatch({type: 'FOOBAR'});
      expect(spy).to.have.been.calledOnce;

      store.dispatch({type: 'FOOBAR'});
      expect(spy).to.have.been.calledTwice;
    });

    it('Subscribe should return an unsubscribe function', () => {
      const store = new AnduxStore(reducers);
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
      const store = new AnduxStore(reducers);
      expect(store.observe).to.exist;
    });

    it('Observe should return an observable', () => {
      const store = new AnduxStore(reducers);
      const observable = store.observe('reducerOne.test');

      expect(observable instanceof Observable).to.equal(true);
    });

    it('Observable should return the initial value when starting to observe', () => {
      const store = new AnduxStore(reducers);
      const observable = store.observe('reducerOne.test');

      let result;

      observable.subscribe(foo => {
        result = foo;
      });

      expect(result).to.equal('foobar1');
    });

    it('Observable should only trigger when the observed value changes', () => {
      class FooReducer extends AnduxReducer {
        public key = 'foo';
        public initialState = Map({
          foo: 'bar',
          bar: 'foo',
          map: Map({
            foo: 'bar',
            list: List<any>([])
          })
        });

        changeFoo(state, action) {
          return state.set('foo', 'foo was changed');
        }

        changeMap(state, action) {
          return state.setIn(['map', 'foo'], 'map was changed');
        }
      }

      class BarReducer extends AnduxReducer {
        public key = 'bar';
        public initialState = Map({
          foo: 'bar',
          bar: 'foo'
        });
      }

      const store = new AnduxStore({
        foo: FooReducer,
        bar: BarReducer
      });

      const fooSpy1 = sinon.spy();
      const fooSpy2 = sinon.spy();
      const fooSpy3 = sinon.spy();
      const fooSpy4 = sinon.spy();

      const barSpy1 = sinon.spy();
      const barSpy2 = sinon.spy();

      store.observe('foo.foo').subscribe(fooSpy1);
      store.observe('foo.bar').subscribe(fooSpy2);
      store.observe('foo.map.foo').subscribe(fooSpy3);
      store.observe('foo.map.list').subscribe(fooSpy4);

      store.observe('bar.foo').subscribe(barSpy1);
      store.observe('bar.bar').subscribe(barSpy2);

      // Called the first time with the initial value
      expect(fooSpy1).to.have.been.calledOnce;
      expect(fooSpy1).to.have.been.calledWith('bar');

      expect(fooSpy2).to.have.been.calledOnce;
      expect(fooSpy2).to.have.been.calledWith('foo');

      expect(fooSpy3).to.have.been.calledOnce;
      expect(fooSpy3).to.have.been.calledWith('bar');

      expect(fooSpy4).to.have.been.calledOnce;

      expect(barSpy1).to.have.been.calledOnce;
      expect(barSpy1).to.have.been.calledWith('bar');

      expect(barSpy2).to.have.been.calledOnce;
      expect(barSpy2).to.have.been.calledWith('foo');

      // Fire an action that should change foo, the observable should be notified
      store.dispatch({
        type: 'CHANGE_FOO'
      });

      expect(fooSpy1).to.have.been.calledTwice;
      expect(fooSpy1).to.have.been.calledWith('foo was changed');

      expect(fooSpy2).to.have.been.calledOnce;
      expect(fooSpy2).to.have.been.calledWith('foo');

      expect(fooSpy3).to.have.been.calledOnce;
      expect(fooSpy3).to.have.been.calledWith('bar');

      expect(fooSpy4).to.have.been.calledOnce;

      expect(barSpy1).to.have.been.calledOnce;
      expect(barSpy1).to.have.been.calledWith('bar');

      expect(barSpy2).to.have.been.calledOnce;
      expect(barSpy2).to.have.been.calledWith('foo');

      // Check a map inside a map
      store.dispatch({
        type: 'CHANGE_MAP'
      });

      expect(fooSpy1).to.have.been.calledTwice;
      expect(fooSpy1).to.have.been.calledWith('foo was changed');

      expect(fooSpy2).to.have.been.calledOnce;
      expect(fooSpy2).to.have.been.calledWith('foo');

      expect(barSpy1).to.have.been.calledOnce;
      expect(barSpy1).to.have.been.calledWith('bar');

      expect(barSpy2).to.have.been.calledOnce;
      expect(barSpy2).to.have.been.calledWith('foo');

      expect(fooSpy3).to.have.been.calledTwice;
      expect(fooSpy3).to.have.been.calledWith('map was changed');

      expect(fooSpy4).to.have.been.calledOnce;
    });

    it('should work properly when listeners trigger a new state change', done => {

      class FooReducer extends AnduxReducer {
        public key = 'foo';
        public initialState = Map({
          foo: undefined,
          bar: undefined
        });

        changeBar(state, action) {
          return state.set('bar', 'new bar value');
        }

        changeFoo(state, action) {
          return state.set('foo', 'new foo value');
        }
      }

      const store = new AnduxStore({
        foo: FooReducer
      });

      // Foo listener
      let fooCounter = 0;
      let fooInitialValue = true;
      let fooSecondValue = true;

      store.observe('foo.foo').subscribe(newValue => {
        fooCounter++;

        if (newValue) {
          fooSecondValue = newValue;
          store.dispatch({
            type: 'CHANGE_BAR'
          });
        } else {
          fooInitialValue = newValue;
        }
      });

      // Bar listener
      let barCounter = 0;
      let barInitialValue = true;
      let barSecondValue = true;

      store.observe('foo.bar').subscribe(newValue => {
        barCounter++;

        if (newValue) {
          barSecondValue = newValue;

          expect(fooInitialValue).to.equal(undefined);
          expect(fooSecondValue).to.equal('new foo value');
          expect(fooCounter).to.equal(2);

          expect(barInitialValue).to.equal(undefined);
          expect(barSecondValue).to.equal('new bar value');
          expect(barCounter).to.equal(2);
          done();
        } else {
          barInitialValue = newValue;
        }
      });

      store.dispatch({
        type: 'CHANGE_FOO'
      });
    });

    it('Should be able to unsubscribe', () => {
      class FooReducer extends AnduxReducer {
        public key = 'foo';
        public initialState = Map({
          foo: 'bar',
          bar: 'foo'
        });

        changeFoo(state, action) {
          return state.set('foo', action.payload);
        }
      }

      const store = new AnduxStore({
        foo: FooReducer
      });

      const observableOne = store.observe('foo.foo');
      const observableTwo = store.observe('foo.foo');

      const spyOne = sinon.spy();
      const spyTwo = sinon.spy();

      const subscriptionOne = observableOne.subscribe(spyOne);
      const subscriptionTwo = observableTwo.subscribe(spyTwo);

      expect(spyOne).to.have.been.calledOnce;
      expect(spyOne).to.have.been.calledWith('bar');

      expect(spyTwo).to.have.been.calledOnce;
      expect(spyTwo).to.have.been.calledWith('bar');

      // Unsubscribe first one
      subscriptionOne.unsubscribe();

      // We unsubscribed this action should have no effect
      store.dispatch({
        type: 'CHANGE_FOO',
        payload: 'bar 2'
      });

      expect(spyOne).to.have.been.calledOnce;
      expect(spyOne).to.have.been.calledWith('bar');

      expect(spyTwo).to.have.been.calledTwice;
      expect(spyTwo).to.have.been.calledWith('bar 2');

      // Unsubscribe second one
      subscriptionTwo.unsubscribe();

      store.dispatch({
        type: 'CHANGE_FOO',
        payload: 'bar 3'
      });

      expect(spyOne).to.have.been.calledOnce;
      expect(spyOne).to.have.been.calledWith('bar');

      expect(spyTwo).to.have.been.calledTwice;
      expect(spyTwo).to.not.have.been.calledWith('bar 3');
    });
  });
});
