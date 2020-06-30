import * as React from 'react';
import {useConstCallback} from './use-const-callback';
/**
 * Hook to store a value and generate callbacks for setting the value to true or false.
 * The identity of the `setTrue` and `setFalse` callbacks will always stay the same.
 *
 * @param initialState - Initial value
 * @returns Array with the current value and an object containing the updater callbacks.
 */
export function useBoolean(initialState) {
  var _a = React.useState(initialState),
    value = _a[0],
    setValue = _a[1];
  var setTrue = useConstCallback(function() {
    return setValue(true);
  });
  var setFalse = useConstCallback(function() {
    return setValue(false);
  });
  return [
    value,
    {
      setTrue: setTrue,
      setFalse: setFalse,
      toggle: value ? setFalse : setTrue,
    },
  ];
}
