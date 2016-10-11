import { expect } from 'chai';
import { SortableActions } from './sortable-actions';

describe('SorttableActions', () => {
  let actions;

  beforeEach(() => {
    @SortableActions('Some')
    class SomeActions {}

    actions = new SomeActions();
  });

  it('should decorate the class with an sort method', () => {
    expect(actions.sort).to.exist;
  });

  describe('sort', () => {
    it('should return an action with the correct type and payload', () => {
      const action = actions.sort('foo', false);
      expect(action.type).to.equal('SORT_SOME');
      expect(action.payload.sortProperty).to.equal('foo');
      expect(action.payload.sortReverse).to.equal(false);
    });
  });
});
