import { expect } from 'chai';
import { Map } from 'immutable';

import { AnduxReducer } from './reducer';

describe('Reducer', () => {
  it('should properly construct', () => {
    class MyReducer extends AnduxReducer {
      initialState = 'foobar';
    }

    const reducer = new MyReducer();
    expect(reducer).to.exist;
    expect(reducer instanceof AnduxReducer).to.equal(true);
  });

  describe('reduce', () => {
    it('should return initialState of no state provided', () => {
      class MyReducer extends AnduxReducer {
        initialState = 'foobar';
      }

      const reducer = new MyReducer();
      const result = reducer['reduce'](undefined, { type: 'SOME_ACTION'});
      expect(result).to.equal('foobar');
    });

    it('should throw an error when no state is passed and no initialState is set', () => {
      class MyReducer extends AnduxReducer {}

      const reducer = new MyReducer();

      function reduce() {
        reducer['reduce'](undefined, { type: 'SOME_ACTION'});
      }

      expect(reduce).to.throw('Reducer doesnt have an initialState');
    });

    it('should call the appropriate method on the class based on the actionType', () => {
      let myState = Map({
        foo: 'bar'
      });

      class MyReducer extends AnduxReducer {
        initialState = myState;
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

