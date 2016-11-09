import { List, Map } from 'immutable';

import { getReducerClassName } from '../utils';
import { Transformer, Transformable } from './transformable';

export function SortableReducer(reducerName: string) {
  return (reducer) => {
    // Make sure it's transformable
    Transformable(reducer);

    if (!reducerName) {
      throw new Error('Should pass an reducerName to sortableReducer decorator');
    }

    // Grabs the reducer name, we use the name of the reducer to by convention setup
    // the names of the actionListeners
    const name = getReducerClassName(reducerName);

    // Cache previous values to prevent executing sort on every state change
    let previousSortProperty;
    let previousSortReverse;
    let previousItems;

    // Sort function
    const sortFunction = function(state) {
      const currentSortProperty: string = state.get('sortProperty');
      const currentSortReverse: boolean = state.get('sortReverse');
      const currentItems: List<any> = state.get('items');

      if ( previousSortProperty !== currentSortProperty ||
           previousSortReverse  !== currentSortReverse  ||
           previousItems        !== currentItems
      ) {
        if (currentSortProperty && currentItems.size > 0) {
          let items: List<any>;

          items = <List<any>> currentItems.sortBy(item => {
            if (item[currentSortProperty] !== undefined) {
              return item[currentSortProperty];
            } else if (Map.isMap(item) && item.get(currentSortProperty)) {
              return item.get(currentSortProperty);
            }
          });

          if (currentSortReverse) {
            items = <List<any>> items.reverse();
          }

          state = state.set('items', items);

          previousItems         = items;
          previousSortProperty  = currentSortProperty;
          previousSortReverse   = currentSortReverse;
        }
      }

      return state;
    };

    // Add transformer
    const transformer = new Transformer('sortable', sortFunction , 50);
    reducer.prototype.addTransformer(transformer);

    // Define reducer handler, sorting get's done by the transformer
    // reducer should call the transform method from the transformable decorator
    Object.defineProperty(reducer.prototype, `sort${name}`, {
      value: function(state, action) {
        state = state.set('sortProperty', action.payload.sortProperty);
        state = state.set('sortReverse', action.payload.sortReverse);
        return state;
      }
    });
  };
}
