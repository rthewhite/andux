import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { camelcaseToStoreSelector } from './utils';

const ObserveDecorator = function (selector?: string): Function {
  return function decorate(target: any, key: string): void {
    let subject: BehaviorSubject<any>;

    function getSubject(): BehaviorSubject<any> {
      if (!subject) {
        // Make sure the store is injected
        if (!this.store) {
          throw new Error('Observe decorator can only be used if the store is injected');
        }

        // If no selector is given, convert the propertyName to selector
        let keySelector = selector || key;

        if (keySelector.endsWith('$')) {
          keySelector = keySelector.substr(0, key.length - 1);
        }

        // Should only convert camelcase when using the property key
        if (!selector && key) {
          keySelector = camelcaseToStoreSelector(keySelector);
        }

        subject = this.store.observe(keySelector);
      }

      return subject;
    }

    // Replace the property with getter function
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: getSubject,
        enumerable: true,
        configurable: true
      });
    }
  };
};

export const observe = ObserveDecorator;
export const Observe = ObserveDecorator;
