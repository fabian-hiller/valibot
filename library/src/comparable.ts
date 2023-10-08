import { expect } from 'vitest';

/**
 * Prepares an object so that it can be compared to another with `.toEqual`.
 * @param value The object to prepare.
 * @returns The comparable object.
 */
export function comparable(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => comparable(item));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, any>>(
      (object, [key, value]) => {
        if (typeof value === 'function') {
          object[key] = expect.any(Function);
        } else {
          object[key] = comparable(value);
        }
        return object;
      },
      {}
    );
  }
  return value;
}
