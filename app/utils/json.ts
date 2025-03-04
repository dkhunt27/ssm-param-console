import { isPlainObject as _isPlainObject } from 'lodash';

export const valueIsJson = (value: any) => {
  let isJson = false;
  if (value && value.indexOf('{') === 0) {
    try {
      const valueObj = JSON.parse(value);
      if (_isPlainObject(valueObj)) {
        isJson = true;
      }
    } catch {
      // do nothing, already false
    }
  }
  return isJson;
};
