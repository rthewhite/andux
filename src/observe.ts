import { Observable } from 'rxjs';
import { camelcaseToStoreSelector } from './utils';

export const observe = function observeDecorator(selector?: string): Function {
  return function(target: any, key: string): void {

    function getObservable(): Observable<any> {
      // Make sure the store is injected
      if (!this.store) {
        throw new Error('Observe decorator can only be used if the store is injected');
      }

      // If no selector is given, convert the propertyName to selector
      if (!selector) {
        selector = camelcaseToStoreSelector(key);
      }

      return this.store.observe(selector);
    }

    // Replace the property with getter function
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getObservable,
        enumerable: true,
        configurable: true
      });
    }
  };
};
