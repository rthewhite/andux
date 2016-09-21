import { Map } from 'immutable';

import { convertActionTypeToMethodName } from '../utils';

export class Reducer {
  public initialState = Map();

  constructor() {
    // reducer loses it's scope when passed to Redux, create binded version
    // this['reduce'] = this['reduce'].bind(this);
  }
}

Object.defineProperty(Reducer.prototype, `reduce`, {
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
  }
});

