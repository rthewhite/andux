import { expect } from 'chai';
import { Map, List } from 'immutable';

import { Reducer } from './reducer';
import { CrudReducer } from './crud-reducer';

@CrudReducer()
class SomeReducer extends Reducer {}
const reducer = new SomeReducer();

describe('CrudReducer', () => {
  describe('loadItems', () => {
    describe('loadItemsStarted', () => {
      it('should define only define a loadItemsStarted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          loadItemsMyStarted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['loadItemsMyStarted']).to.exist;
        expect(myReducer['loadItemsMyStarted']()).to.equal('foobar');
      });

      it('should set loading to true and clear any previous errors', () => {
        let state = Map({
          loadError: 'some error'
        });
        const action = {
          type: 'LOAD_ITEMS_SOME_STARTED'
        };

        state = reducer['loadItemsSomeStarted'](state, action);
        expect(state.get('loading')).to.equal(true);
        expect(state.get('loadError')).to.equal(undefined);
      });
    });

    describe('loadItemsSuccess', () => {
      it('should only define a loadItemsSuccess handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          loadItemsMySuccess() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['loadItemsMySuccess']).to.exist;
        expect(myReducer['loadItemsMySuccess']()).to.equal('foobar');
      });

      it('should set the items and loaded on the state', () => {
        const items = List<string>(['foo1', 'foo2']);

        let state = Map({});
        const action = {
          type: 'LOAD_ITEMS_SOME_STARTED',
          payload: {
            response: items
          }
        };

        state = reducer['loadItemsSomeSuccess'](state, action);
        expect(state.get('items')).to.equal(items);
        expect(state.get('loaded')).to.equal(true);
      });
    });

    describe('loadItemsCompleted', () => {
      it('should only define a loadItemsCompleted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          loadItemsMyCompleted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['loadItemsMyCompleted']).to.exist;
        expect(myReducer['loadItemsMyCompleted']()).to.equal('foobar');
      });


      it('should set loading to false on the state', () => {
        let state = Map({});
        const action = {
          type: 'LOAD_ITEMS_SOME_COMPLETED',
          payload: {}
        };

        state = reducer['loadItemsSomeCompleted'](state, action);
        expect(state.get('loading')).to.equal(false);
      });
    });

    describe('loadItemsFailed', () => {
      it('should only define a loadItemsFailed handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          loadItemsMyFailed() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['loadItemsMyFailed']).to.exist;
        expect(myReducer['loadItemsMyFailed']()).to.equal('foobar');
      });

      it('should set loading and loaded to false and store the error on the state', () => {
        let state = Map({});
        const action = {
          type: 'LOAD_ITEMS_SOME_FAILED',
          payload: {
            response: 'some nasty error'
          }
        };

        state = reducer['loadItemsSomeFailed'](state, action);
        expect(state.get('loadError')).to.equal('some nasty error');
      });
    });
  });

  describe('getItem', () => {
    describe('getItemStarted', () => {
      it('should only define a getItemStarted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          getItemMyStarted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['getItemMyStarted']).to.exist;
        expect(myReducer['getItemMyStarted']()).to.equal('foobar');
      });

      it('should set loading to true on the state and clear any previous errors', () => {
        let state = Map({ getError: 'foobar'});
        const action = {
          type: 'GET_ITEM_SOME_STARTED',
          payload: {}
        };

        state = reducer['getItemSomeStarted'](state, action);
        expect(state.get('loading')).to.equal(true);
        expect(state.get('getError')).to.equal(undefined);
      });
    });

    describe('getItemSuccess', () => {
      it('should only define a getItemSuccessHandler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          getItemMySuccess() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['getItemMySuccess']).to.exist;
        expect(myReducer['getItemMySuccess']()).to.equal('foobar');
      });

      it('should insert the new item into the state', () => {
        let state = Map({
          items: List<any>([])
        });

        const action = {
          type: 'GET_ITEM_SOME_SUCCESS',
          payload: {
            response: Map({ uuid: 1, foo: 'foobar'})
          }
        };

        state = reducer['getItemSomeSuccess'](state, action);

        expect(state.get('items').size).to.equal(1);
        expect(state.getIn(['items', 0, 'foo'])).to.equal('foobar');
      });

      it('should replace any previous version with the same unique identifier', () => {
        let state = Map({
          items: List<any>([
            Map({
              uuid: 1,
              foo: 'bar1'
            }),
            Map({
              uuid: 2,
              foo: 'bar2'
            })
          ])
        });

        const action = {
          type: 'GET_ITEM_SOME_SUCCESS',
          payload: {
            response: Map({ uuid: 1, foo: 'not bar anymore'})
          }
        };

        state = reducer['getItemSomeSuccess'](state, action);

        expect(state.get('items').size).to.equal(2);
        expect(state.getIn(['items', 0, 'foo'])).to.equal('not bar anymore');
      });
    });

    describe('getItemFailed', () => {
      it('should only define a getItemFailed handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          getItemMyFailed() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['getItemMyFailed']).to.exist;
        expect(myReducer['getItemMyFailed']()).to.equal('foobar');
      });

      it('should set the loading state to false', () => {
        let state = Map({});
        let action = { type: 'GET_ITEM_SOME_FAILED', payload: { response: 'some error' }};
        state = reducer['getItemSomeFailed'](state, action);
        expect(state.get('getError')).to.equal('some error');
      });
    });

    describe('getItemCompleted', () => {
      it('should define a getItemCompleted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          getItemMyCompleted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['getItemMyCompleted']).to.exist;
        expect(myReducer['getItemMyCompleted']()).to.equal('foobar');
      });

      it('should set the loading state to false', () => {
        let state = Map({});
        let action = { type: 'GET_ITEM_SOME_COMPLETED', payload: {} };
        state = reducer['getItemSomeCompleted'](state, action);
        expect(state.get('loading')).to.equal(false);
      });
    });
  });

  describe('updateItem', () => {
    describe('updateItemStarted', () => {
      it('should only define a updateItemStarted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          updateItemMyStarted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['updateItemMyStarted']).to.exist;
        expect(myReducer['updateItemMyStarted']()).to.equal('foobar');
      });

      it('should updating to true and clear any previous error in the state', () => {
        let state = Map({ updateError: 'some error'});
        let action = { type: 'UPDATE_ITEM_SOME_STARTED'};
        state = reducer['updateItemSomeStarted'](state, action);
        expect(state.get('updating')).to.equal(true);
        expect(state.get('updateError')).to.equal(undefined);
      });
    });

    describe('updateItemSuccess', () => {
      it('should onlye define a updateItemSuccess handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          updateItemMySuccess() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['updateItemMySuccess']).to.exist;
        expect(myReducer['updateItemMySuccess']()).to.equal('foobar');
      });

      it('should update the item in the state', () => {
        let state = Map({
          items: List<any>([
            Map({
              uuid: 1,
              value: 'foobar1'
            }),
            Map({
              uuid: 2,
              value: 'foobar2'
            }),
          ])
        });

        const item = Map({
          uuid: 1,
          value: 'not foobar anymore'
        });
        const action = {
          type: 'UPDATE_ITEM_SOME_SUCCESS',
          payload: {
            response: item
          }
        };
        state = reducer['updateItemSomeSuccess'](state, action);

        expect(state.get('items').size).to.equal(2);
        expect(state.getIn(['items', 0, 'value'])).to.equal('not foobar anymore');
        expect(state.getIn(['items', 0, 'uuid'])).to.equal(1);
        expect(state.getIn(['items', 1, 'value'])).to.equal('foobar2');
        expect(state.getIn(['items', 1, 'uuid'])).to.equal(2);
      });
    });

    describe('updateItemFailed', () => {
      it('should only define a updateItemFailed handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          updateItemMyFailed() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['updateItemMyFailed']).to.exist;
        expect(myReducer['updateItemMyFailed']()).to.equal('foobar');
      });

      it('should set updateError on the state', () => {
        let state = Map({});
        const action = {
          type: 'UPDATE_ITEM_SOME_FAILED',
          payload: {
            response: 'some error'
          }
        };

        state = reducer['updateItemSomeFailed'](state, action);
        expect(state.get('updateError')).to.equal('some error');
      });
    });

    describe('updateItemCompleted', () => {
      it('should only define a updateItemCompleted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          updateItemMyCompleted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['updateItemMyCompleted']).to.exist;
        expect(myReducer['updateItemMyCompleted']()).to.equal('foobar');
      });

      it('should set the updating property to false on the state', () => {
        let state = Map({});
        const action = { type: 'UPDATE_ITEM_SOME_COMPLETED'};
        state = reducer['updateItemSomeCompleted'](state, action);
        expect(state.get('updating')).to.equal(false);
      });
    });
  });

  describe('deleteItem', () => {
    describe('deleteItemStarted', () => {
      it('should only define a deleteItemStarted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          updateItemMyCompleted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['updateItemMyCompleted']).to.exist;
        expect(myReducer['updateItemMyCompleted']()).to.equal('foobar');
      });

      it('should set deleting to true and clear any previous error in the state', () => {
        let state = Map({ deleteError: 'some error'});
        let action = { type: 'DELETE_ITEM_SOME_STARTED'};
        state = reducer['deleteItemSomeStarted'](state, action);
        expect(state.get('deleting')).to.equal(true);
        expect(state.get('deleteError')).to.equal(undefined);
      });
    });

    describe('deleteItemSuccess', () => {
      it('should only define a deleteItemSuccess handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          deleteItemMySuccess() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['deleteItemMySuccess']).to.exist;
        expect(myReducer['deleteItemMySuccess']()).to.equal('foobar');
      });

      it('should remove the item from the items list in the state', () => {
        let state = Map({
          items: List<any>([
            Map({
              uuid: 1,
              value: 'foo1'
            }),
            Map({
              uuid: 2,
              value: 'foo2'
            }),
            Map({
              uuid: 3,
              value: 'foo3'
            })
          ])
        });

        const item = state.getIn(['items', 1]);

        const action = {
          type: 'DELETE_ITEM_SOME_SUCCESS',
          payload: {
            request: item
          }
        };

        state = reducer['deleteItemSomeSuccess'](state, action);

        expect(state.get('items').size).to.equal(2);
        expect(state.getIn(['items', 0, 'value'])).to.equal('foo1');
        expect(state.getIn(['items', 1, 'value'])).to.equal('foo3');
      });
    });

    describe('deleteItemFailed', () => {
      it('should only define a deleteItemFailed handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          deleteItemMyFailed() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['deleteItemMyFailed']).to.exist;
        expect(myReducer['deleteItemMyFailed']()).to.equal('foobar');
      });

      it('should set delete error on the state', () => {
        let state = Map({});
        let action = { type: 'DELETE_ITEM_SOME_FAILED', payload: { response: 'some error'}};
        state = reducer['deleteItemSomeFailed'](state, action);
        expect(state.get('deleteError')).to.equal('some error');
      });
    });

    describe('deletingItemCompleted', () => {
      it('should only define a deleteItemCompleted handler if none is present', () => {
        @CrudReducer()
        class MyReducer extends Reducer {
          deleteItemMyCompleted() {
            return 'foobar';
          }
        }

        const myReducer = new MyReducer();
        expect(myReducer['deleteItemMyCompleted']).to.exist;
        expect(myReducer['deleteItemMyCompleted']()).to.equal('foobar');
      });

      it('should set deleting to false on the state', () => {
        let state = Map({});
        let action = { type: 'DELETE_ITEM_SOME_COMPLETED'};
        state = reducer['deleteItemSomeCompleted'](state, action);
        expect(state.get('deleting')).to.equal(false);
      });
    });
  });
});
