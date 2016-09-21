import { expect } from 'chai';
import { Map } from 'immutable';

import { Reducer } from './reducer';

describe('Reducer', () => {
  it('should properly construct', () => {
    const reducer = new Reducer();
    expect(reducer).to.exist;
    expect(reducer instanceof Reducer).to.equal(true);
  });

  it('should have an initialState property', () => {
    const reducer = new Reducer();
    expect(reducer.initialState).to.exist;
  });

  describe('reduce', () => {
    it('should return initialState of no state provided', () => {
      const reducer = new Reducer();
      const initialState = Map({ foo: 'foobar' });
      reducer.initialState = initialState;

      const result = reducer['reduce'](undefined, { type: 'SOME_ACTION'});
      expect(result).to.equal(initialState);
    });

    it('should call the appropriate method on the class based on the actionType', () => {
      let myState = Map({
        foo: 'bar'
      });

      class MyReducer extends Reducer {
        myAwesomeAction(state, action) {
          state = state.set('foo', 'not bar anymore');
          return state;
        }
      }

      const reducer = new MyReducer();
      const state = reducer['reduce'](myState, {type: 'MY_AWESOME_ACTION'});

      expect(state.get('foo')).to.equal('not bar anymore');
    });
  });
});

