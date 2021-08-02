import { ValidationError } from 'yup';
import get = require('lodash/get');
import set = require('lodash/set');

export const yupErrorMessageFormatter = (
  yupError: ValidationError,
): Record<string, string> => {
  let errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return set(errors, yupError.path, yupError.message);
    }
    for (const err of yupError.inner) {
      if (!get(errors, err.path)) {
        errors = set(errors, err.path, err.message);
      }
    }
  }
  return errors;
};
