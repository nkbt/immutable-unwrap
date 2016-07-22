import im from 'immutable';
import isPlainObject from 'lodash/isPlainObject';
import isDate from 'lodash/isDate';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';


export const unwrap = obj => {
  if (isString(obj) || isNumber(obj)) {
    return obj;
  }


  if (im.Map.isMap(obj) || im.OrderedMap.isOrderedMap(obj)) {
    if (im.Iterable.isIterable(obj.keySeq().first())) {
      return obj.reduce((result, value, key) =>
      result.concat([[unwrap(key), unwrap(value)]]), []);
    }
    return obj.map(val => unwrap(val)).toObject();
  }

  if (im.Iterable.isIterable(obj)) {
    return obj.map(val => unwrap(val)).toArray();
  }

  if (Array.isArray(obj)) {
    return obj.map(val => unwrap(val));
  }

  if (isPlainObject(obj)) {
    return Object.keys(obj)
      .reduce((result, key) => Object.assign(result, {[key]: unwrap(obj[key])}), {});
  }

  if (isDate(obj)) {
    return obj.getTime();
  }

  return obj;
};
