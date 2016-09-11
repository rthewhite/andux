import { Store } from './../src/store';
import * as store from './../src/store';

describe('Store', () => {

  it('should throw an error if no rootReducer is passed to constructor', () => {
    const construct = () => {
      new Store();
    }
    expect(construct).toThrowError('No rootReducer passed');
  });

  it('should throw an error if no initialState is passed to constructor', () => {
    const construct = () => {
      new Store(() => {});
    }
    expect(construct).toThrowError('No initialState passed');
  });


  describe('getState', () => {
    it('Store should have a getState method', () => {
      const store = new Store(() => {}, {});
      expect(store.getState).toBe('function');
    });
  });

  describe('dispatch', () => {
    it('Store should have a dispatch method', () => {
      const store = new Store(() => {}, {});
      expect(store.dispatch).toBe('function');
    });
  });
});

