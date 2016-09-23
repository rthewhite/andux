import { expect } from 'chai';
import { Map, List } from 'immutable';

import { AnduxReducer } from './reducer';
import { PaginatableReducer } from './paginatable-reducer';

@PaginatableReducer()
class AwesomeReducer extends AnduxReducer {}

const reducer = new AwesomeReducer();

describe('PaginatableReducer', () => {

  it('should define changePage handler', () => {
    expect(reducer['changePageAwesome']).to.exist;
  });

  it('should define changeItemsPerPage handler', () => {
    expect(reducer['changeItemsPerPageAwesome']).to.exist;
  });

  describe('changePage', () => {
    it('should change page when requested page is available', () => {
      let state = Map({
        pageNr: 1,
        numberOfPages: 2
      });
      let action = { type: 'CHANGE_PAGE_AWESOME', payload: { page: 2 }};

      state = reducer['changePageAwesome'](state, action);

      expect(state.get('pageNr')).to.equal(2);
    });

    it('should not changePage when request page is not available', () => {
      let state = Map({
        pageNr: 1,
        numberOfPages: 1
      });
      let action = { type: 'CHANGE_PAGE_AWESOME', payload: { page: 2 }};

      state = reducer['changePageAwesome'](state, action);

      expect(state.get('pageNr')).to.equal(1);
    });

    it('should not changePage when pageNr is a negative number', () => {
      let state = Map({
        pageNr: 1,
        numberOfPages: 1
      });
      let action = { type: 'CHANGE_PAGE_AWESOME', payload: { page: -1 }};

      state = reducer['changePageAwesome'](state, action);

      expect(state.get('pageNr')).to.equal(1);
    });
  });

  describe('changeItemsPerPage', () => {
    it('should change the items per page on the state', () => {
      let state = Map({
        pageNr: 1,
        numberOfPages: 1,
        itemsPerPage: 100
      });
      let action = { type: 'CHANGE_ITEMS_PER_PAGE_AWESOME', payload: { itemsPerPage: 200 }};

      state = reducer['changeItemsPerPageAwesome'](state, action);

      expect(state.get('itemsPerPage')).to.equal(200);
    });
  });

  describe('paginate transformer', () => {
    it('should work when no pageNr or itemsPerPage is set on the state', () => {
      let state = Map({
        items: List<string>(['foo1', 'foo2', 'foo3', 'foo4'])
      });

      // Trigger some random action on the reducer should trigger the transformer
      let action = { type: 'SOME_RANDOM_ACTION', payload: { page: 2 }};
      state = reducer['reduce'](state, action);

      expect(state.get('pageNr')).to.equal(1);
      expect(state.get('itemsPerPage')).to.equal(10);
      expect(state.get('numberOfPages')).to.equal(1);
    });

    it('should paginate based on the itemsPerPage and pageNr in the state', () => {
      let state = Map({
        pageNr: 1,
        itemsPerPage: 2,
        items: List<string>(['foo1', 'foo2', 'foo3', 'foo4'])
      });

      // Trigger some random action on the reducer should trigger the transformer
      let action = { type: 'SOME_RANDOM_ACTION', payload: { page: 2 }};
      state = reducer['reduce'](state, action);

      expect(state.get('pageNr')).to.equal(1);
      expect(state.get('itemsPerPage')).to.equal(2);
      expect(state.get('numberOfPages')).to.equal(2);

      const page1 = <List<string>>state.get('page');
      expect(page1.get(0)).to.equal('foo1');
      expect(page1.get(1)).to.equal('foo2');

      state = reducer['reduce'](state, { type: 'CHANGE_PAGE_AWESOME', payload: { page: 2}});
      const page2 = <List<string>>state.get('page');
      expect(page2.get(0)).to.equal('foo3');
      expect(page2.get(1)).to.equal('foo4');
    });
  });
});
