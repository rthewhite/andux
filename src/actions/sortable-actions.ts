import {
  getActionsClassName
} from '../utils';

export function SortableActions(): Function {
  return (target: any, key: string, descriptor: any ) => {
    const className = getActionsClassName(target.name).toUpperCase();

    Object.defineProperty(target.prototype, 'sort', {
      value: function(sortProperty: string, sortReverse: boolean) {
        return {
          type: `SORT_${className}`,
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
