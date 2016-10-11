import { expect } from 'chai';
import { PaginatableActions } from './paginatable-actions';

describe('PaginatableActions', () => {
  let actions;

  beforeEach(() => {
    @PaginatableActions('Some')
    class SomeActions {}

    actions = new SomeActions();
  });

  it('should decorate the class with an changePage method', () => {
    expect(actions.changePage).to.exist;
  });

  it('should decorate the class with an changeItemsPerPage method', () => {
    expect(actions.changeItemsPerPage).to.exist;
  });

  describe('changePage', () => {
    it('should return an action with the correct type and payload', () => {
      const action = actions.changePage(1);
      expect(action.type).to.equal('CHANGE_PAGE_SOME');
      expect(action.payload.page).to.equal(1);
    });
  });

  describe('changeItemsPerPage', () => {
    it('should return an action with the correct type and payload', () => {
      const action = actions.changeItemsPerPage(10);
      expect(action.type).to.equal('CHANGE_ITEMS_PER_PAGE_SOME');
      expect(action.payload.itemsPerPage).to.equal(10);
    });
  });
});
