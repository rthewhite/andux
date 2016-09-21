import { expect } from 'chai';
import { Map, List } from 'immutable';

import { Reducer } from './reducer';
import { SortableReducer } from './sortable-reducer';

@SortableReducer()
class AwesomeReducer extends Reducer {}

const reducer = new AwesomeReducer();

describe('SortableReducer', () => {
  it('should define a sort handler', () => {
    expect(reducer['sortAwesome']).to.exist;
  });

  describe('sort', () => {
    it('should set the payload correctly on the state', () => {
      let state = Map({
        items: List<string>([Map({foo: 'bar1'}), Map({foo: 'bar2'}), Map({foo: 'bar3'})])
      });

      const action1 = {
        type: 'SORT_AWESOME',
        payload: {
          sortProperty: 'foo',
          sortReverse: false
        }
      };

      const action2 = {
        type: 'SORT_AWESOME',
        payload: {
          sortProperty: 'bar',
          sortReverse: true
        }
      };

      state = reducer['sortAwesome'](state, action1);
      expect(state.get('sortProperty')).to.equal('foo');
      expect(state.get('sortReverse')).to.equal(false);

      state = reducer['sortAwesome'](state, action2);
      expect(state.get('sortProperty')).to.equal('bar');
      expect(state.get('sortReverse')).to.equal(true);
    });
  });

  describe('sort transformer', () => {
    it('should sort properly based on the sortProperty and sortReverse on the state', () => {
      let state = Map({
        items: List<string>([Map({foo: 'bar3'}), Map({foo: 'bar1'}), Map({foo: 'bar2'})])
      });

      const action1 = {
        type: 'SORT_AWESOME',
        payload: {
          sortProperty: 'foo',
          sortReverse: false
        }
      };

      state = reducer['reduce'](state, action1);

      expect(state.getIn(['items', 0, 'foo'])).to.equal('bar1');
      expect(state.getIn(['items', 1, 'foo'])).to.equal('bar2');
      expect(state.getIn(['items', 2, 'foo'])).to.equal('bar3');

      const action2 = {
        type: 'SORT_AWESOME',
        payload: {
          sortProperty: 'foo',
          sortReverse: true
        }
      };

      state = reducer['reduce'](state, action2);

      expect(state.getIn(['items', 0, 'foo'])).to.equal('bar3');
      expect(state.getIn(['items', 1, 'foo'])).to.equal('bar2');
      expect(state.getIn(['items', 2, 'foo'])).to.equal('bar1');
    });
  });
});
