import { Observable } from 'rxjs';
import { camelcaseToStoreSelector } from './utils';

export function observe(selector?: string): Function {
  return function decorate(target: any, key: string): void {
    let observable: Observable<any>;
    function getObservable(): Observable<any> {
      if (!observable) {
        // Make sure the store is injected
        if (!this.store) {
          throw new Error('Observe decorator can only be used if the store is injected');
        }

        // If no selector is given, convert the propertyName to selector
        let keySelector = selector || key;

        if (keySelector.endsWith('$')) {
          keySelector = keySelector.substr(0, key.length - 1);
        }

        keySelector = camelcaseToStoreSelector(keySelector);

        observable = this.store.observe(keySelector);
      }

      return observable;
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
