export function SortableActions(reducer: string): Function {
  return (target: any, key: string, descriptor: any ) => {
    const reducerName = reducer.toUpperCase();

    Object.defineProperty(target.prototype, 'sort', {
      value: function(sortProperty: string, sortReverse: boolean) {
        return {
          type: `SORT_${reducerName}`,
          payload: {
            sortProperty,
            sortReverse
          }
        };
      }
    });

    return target;
  };
}
