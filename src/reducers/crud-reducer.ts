import { List } from 'immutable';

import { getReducerClassName } from '../utils';

export function CrudReducer(reducerName: string) {
  return (reducer) => {
    // Grabs the reducer name, we use the name of the reducer to by convention setup
    // the names of the actionListeners
    const name = getReducerClassName(reducerName);

    // LOAD
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `loadItems${name}Started`)) {
      Object.defineProperty(reducer.prototype, `loadItems${name}Started`, {
        value: function(state, action) {
          state = state.set('loading', true);
          state = state.set('loaded', false);
          state = state.set('loadError', undefined);
          return state;
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `loadItems${name}Success`)) {
      Object.defineProperty(reducer.prototype, `loadItems${name}Success`, {
        value: function(state, action) {
          const response = action.payload.response;

          if (response && response.results) {
            state = state.set('items', response.results);
          } else {
            state = state.set('items', response);
          }

          state = state.set('loaded', true);
          return state;
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `loadItems${name}Failed`)) {
      Object.defineProperty(reducer.prototype, `loadItems${name}Failed`, {
        value: function(state, action) {
          return state.set('loadError', action.payload.response);
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `loadItems${name}Completed`)) {
      Object.defineProperty(reducer.prototype, `loadItems${name}Completed`, {
        value: function(state, action) {
          return state.set('loading', false);
        }
      });
    }

    // GET
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `getItem${name}Started`)) {
      Object.defineProperty(reducer.prototype, `getItem${name}Started`, {
        value: function(state, action) {
          state = state.set('getError', undefined);
          state = state.set('loading', true);
          return state;
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `getItem${name}Success`)) {
      Object.defineProperty(reducer.prototype, `getItem${name}Success`, {
        value: function(state, action) {
          let items = state.get('items');
          items = insertItem(items, action.payload.response);
          state = state.set('items', items);
          return state;
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `getItem${name}Failed`)) {
      Object.defineProperty(reducer.prototype, `getItem${name}Failed`, {
        value: function(state, action) {
          return state.set('getError', action.payload.response);
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `getItem${name}Completed`)) {
      Object.defineProperty(reducer.prototype, `getItem${name}Completed`, {
        value: function(state, action) {
          return state.set('loading', false);
        }
      });
    }

    // Create
    const createMethodStarted = `createItem${name}Started`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, createMethodStarted)) {
      Object.defineProperty(reducer.prototype, createMethodStarted, {
        value: function(state, action) {
          state = state.set('creating', true);
          state = state.set('createError', undefined);
          return state;
        }
      });
    }

    const createMethodSuccess = `createItem${name}Success`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, createMethodSuccess)) {
      Object.defineProperty(reducer.prototype, createMethodSuccess, {
        value: function(state, action) {
          let items = state.get('items');
          items = insertItem(items, action.payload.response);
          return state.set('items', items);
        }
      });
    }

    const createMethodFailed = `createItem${name}Failed`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, createMethodFailed)) {
      Object.defineProperty(reducer.prototype, createMethodFailed, {
        value: function(state, action) {
          return state.set('createError', action.payload.response);
        }
      });
    }

    const createMethodCompleted = `createItem${name}Completed`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, createMethodCompleted)) {
      Object.defineProperty(reducer.prototype, createMethodCompleted, {
        value: function(state, action) {
          return state.set('creating', false);
        }
      });
    }

    // UPDATE
    const updateMethodStarted = `updateItem${name}Started`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, updateMethodStarted)) {
      Object.defineProperty(reducer.prototype, updateMethodStarted, {
        value: function(state, action) {
          state = state.set('updating', true);
          state = state.set('updateError', undefined);
          return state;
        }
      });
    }

    const updateMethodSuccess = `updateItem${name}Success`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, updateMethodSuccess)) {
      Object.defineProperty(reducer.prototype, updateMethodSuccess, {
        value: function(state, action) {
          let items = state.get('items');
          items = insertItem(items, action.payload.response);
          return state.set('items', items);
        }
      });
    }

    const updateMethodFailed = `updateItem${name}Failed`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, updateMethodFailed)) {
      Object.defineProperty(reducer.prototype, updateMethodFailed, {
        value: function(state, action) {
          return state.set('updateError', action.payload.response);
        }
      });
    }

    const updateMethodCompleted = `updateItem${name}Completed`;
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, updateMethodCompleted)) {
      Object.defineProperty(reducer.prototype, updateMethodCompleted, {
        value: function(state, action) {
          return state.set('updating', false);
        }
      });
    }

    // DELETE
    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `deleteItem${name}Started`)) {
      Object.defineProperty(reducer.prototype, `deleteItem${name}Started`, {
        value: function(state, action) {
          state = state.set('deleting', true);
          state = state.set('deleteError', undefined);
          return state;
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `deleteItem${name}Success`)) {
      Object.defineProperty(reducer.prototype, `deleteItem${name}Success`, {
        value: function(state, action) {
          let items = state.get('items');
          items = removeItem(items, action.payload.request);
          return state.set('items', items);
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `deleteItem${name}Failed`)) {
      Object.defineProperty(reducer.prototype, `deleteItem${name}Failed`, {
        value: function(state, action) {
          return state.set('deleteError', action.payload.response);
        }
      });
    }

    if (!Reflect.getOwnPropertyDescriptor(reducer.prototype, `deleteItem${name}Completed`)) {
      Object.defineProperty(reducer.prototype, `deleteItem${name}Completed`, {
        value: function(state, action) {
          state = state.set('deleting', false);
          return state;
        }
      });
    }

    function insertItem(items: List<any>, item, uniqueKey = 'uuid') {
      if (items && items.size > 0) {

        let toInsertKey = item[uniqueKey];

        if (typeof item.get === 'function') {
          toInsertKey = item.get(uniqueKey);
        }


        const index = items.findIndex(currentItem => {
          let current = currentItem[uniqueKey];

          if (typeof currentItem.get === 'function') {
            current = currentItem.get(uniqueKey);
          }

          return current === toInsertKey;
        });

        if (index > -1) {
          items = items.update(index, () => { return item; });
        } else {
          items = items.push(item);
        }
      } else {
        items = List([item]);
      }

      return items;
    }

    function removeItem(items: List<any>, item, uniqueKey = 'uuid') {
      if (items && items.size > 0) {
        const index = items.findIndex(currentItem => {
          return currentItem === item;
        });

        items = items.delete(index);
      }

      return items;
    }
  };
}
