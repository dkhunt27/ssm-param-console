import { isPlainObject as _isPlainObject, every as _every } from 'lodash';

export const valueIsJson = (value: any) => {
  let isJson = false;
  if (value) {
    if (value.indexOf('{') === 0) {
      try {
        const valueObj = JSON.parse(value);
        if (_isPlainObject(valueObj)) {
          isJson = true;
        }
      } catch {
        // do nothing, already false
      }
    } else if (value.indexOf('[') === 0) {
      try {
        const valueObj = JSON.parse(value);
        const allAreObjects = _every(valueObj, _isPlainObject);
        if (allAreObjects) {
          isJson = true;
        }
      } catch {
        // do nothing, already false
      }
    }
  }
  return isJson;
};
