import { Map } from 'immutable';

import { convertActionTypeToMethodName } from '../utils';

export class AnduxReducer {
  public initialState: any;
  public key: string;

  constructor() {
    // Reduce method losed scope when passed to redux
    this['reduce'] = this['reduce'].bind(this);
  }
}

Object.defineProperty(AnduxReducer.prototype, `reduce`, {
  value: function(state?: Map<string, any>, action?: any) {
    if (action && state) {
      // Convert the action type to method name
      // example:  API_CALL_LOAD_STARTED > apiCallLoadStarted
      const methodName = convertActionTypeToMethodName(action.type);

      // Check if a handler for this action is defined and execute
      if (this[methodName]) {
        state = this[methodName](state, action);
      }
    }

    // If we are doing nothing, return the state or initialState if no state is given
    return state || this.initialState;
  },
  writable: true
});

