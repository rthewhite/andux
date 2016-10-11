export function PaginatableActions(reducer: string): Function {
  return (target: any, key: string, descriptor: any ) => {
    const reducerName = reducer.toUpperCase();

    Object.defineProperty(target.prototype, 'changePage', {
      value: function(page: number) {
        return {
          type: `CHANGE_PAGE_${reducerName}`,
          payload: {
            page
          }
        };
      }
    });

    Object.defineProperty(target.prototype, 'changeItemsPerPage', {
      value: function(itemsPerPage: number) {
        return {
          type: `CHANGE_ITEMS_PER_PAGE_${reducerName}`,
          payload: {
            itemsPerPage
          }
        };
      }
    });

    return target;
  };
}
