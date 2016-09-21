import {
  getActionsClassName
} from '../utils';

export function PaginatableActions(): Function {
  return (target: any, key: string, descriptor: any ) => {
    const className = getActionsClassName(target.name).toUpperCase();

    Object.defineProperty(target.prototype, 'changePage', {
      value: function(page: number) {
        return {
          type: `CHANGE_PAGE_${className}`,
          payload: {
            page
          }
        };
      }
    });

    Object.defineProperty(target.prototype, 'changeItemsPerPage', {
      value: function(itemsPerPage: number) {
        return {
          type: `CHANGE_ITEMS_PER_PAGE_${className}`,
          payload: {
            itemsPerPage
          }
        };
      }
    });

    return target;
  };
}
