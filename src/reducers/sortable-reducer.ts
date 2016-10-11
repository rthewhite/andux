import { List } from 'immutable';

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

    // Sort function
    const sortFunction = function(state) {
      const sortProperty: string = state.get('sortProperty');
      const sortReverse: boolean = state.get('sortReverse');
      let items: List<any> = state.get('items');

      if (sortProperty && items.size > 0) {
        items = <List<any>> items.sortBy(item => {
          return item[sortProperty] || item.get(sortProperty);
        });

        if (sortReverse) {
          items = <List<any>> items.reverse();
        }

        state = state.set('items', items);
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
