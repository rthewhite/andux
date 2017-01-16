export function convertMethodNameToActionType(name: string): string {
  return name.replace(/([A-Z])/g, '_$1').toUpperCase();
}

export function convertActionTypeToMethodName(actionType: string): string {
  const lowerCased = actionType.toLowerCase();
  const methodName = lowerCased.replace(/(\_\w)/g, function(m){
    return m[1].toUpperCase();
  });

  return methodName;
}

export function getReducerClassName(name: string): string {
  return name.split('Reducer')[0];
}

export function getActionsClassName(name: string): string {
  return name.split('Actions')[0];
}

export function camelcaseToStoreSelector(name: string): string {
  return name.replace(/([A-Z])/g, function($1) {
    return '.' + $1.toLowerCase();
  });
}
