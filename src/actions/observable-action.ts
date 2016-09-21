import { convertMethodNameToActionType } from './../utils';

export function ObservableAction(): Function {
  return (target: any, key: string, descriptor: any) => {
    const actionType = convertMethodNameToActionType(key);

    return {
      value: function(...args: any[]) {
        return (dispatch) => {
          dispatch({
            type: `${actionType}_STARTED`,
            payload: {
              request: args
            }
          });

          const request = descriptor.value.apply(this, args);

          request.subscribe(
            response => {
              dispatch({
                type: `${actionType}_SUCCESS`,
                payload: {
                  request: args,
                  response
                }
              });
            },
            error => {
              dispatch({
                type: `${actionType}_FAILED`,
                payload: {
                  request: args,
                  response: error
                }
              });
            },
            response => {
              dispatch({
                type: `${actionType}_COMPLETED`,
                payload: {
                  request: args,
                  response
                }
              });
            }
          );

          return request;
        };
      }
    };
  };
}
