import { getReducerClassName } from '../utils';
import { Transformer, Transformable } from './transformable';

export function PaginatableReducer(reducerName: string) {
  return (reducer) => {
    // Make sure it's transformable
    Transformable(reducer);

    if (!reducerName) {
      throw new Error('Should pass an reducerName to paginatableReducer decorator');
    }

    // Grabs the reducer name, we use the name of the reducer to by convention setup
    // the names of the actionListeners
    const name = getReducerClassName(reducerName);

    // Defaults used when not defined on the state yet
    const defaults = {
      pageNr: 1,
      itemsPerPage: 10
    };

    // Paginate method
    const paginateFunction = function(state) {
      // Make sure the needed information is on the state
      if (!state.get('pageNr')) {
        state = state.set('pageNr', defaults.pageNr);
      }

      if (!state.get('itemsPerPage')) {
        state = state.set('itemsPerPage', defaults.itemsPerPage);
      }

      const pageNr = state.get('pageNr');
      const itemsPerPage = state.get('itemsPerPage');
      const items = state.get('items');

      if (items.size <= itemsPerPage) {
        state = state.set('page', items);
      } else {
        const start = (pageNr - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        state = state.set('page', items.slice(start, end));
      }

      state = state.set('numberOfPages', Math.ceil(items.size / itemsPerPage));

      return state;
    };

    // Add transformer
    const transformer = new Transformer('paginatable', paginateFunction , 60);
    reducer.prototype.addTransformer(transformer);

    // Define reducer handlers
    Object.defineProperty(reducer.prototype, `changePage${name}`, {
      value: function(state, action) {
        const newPage = action.payload.page;

        if (newPage >= 1 && newPage <= state.get('numberOfPages')) {
          state = state.set('pageNr', newPage);
        }

        return state;
      }
    });

    Object.defineProperty(reducer.prototype, `changeItemsPerPage${name}`, {
      value: function(state, action) {
        state = state.set('itemsPerPage', action.payload.itemsPerPage);
        state = state.set('pageNr', 1);
        return state;
      }
    });

    return reducer;
  };
}
