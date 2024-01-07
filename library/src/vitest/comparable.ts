import { expect } from 'vitest';

/**
 * Prepares an object so that it can be compared to another with `.toEqual`.
 *
 * @param value The object to prepare.
 *
 * @returns The comparable object.
 */
export function comparable<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => comparable(item)) as T;
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (object, [key, value]) => {
        if (typeof value === 'function') {
          object[key] = expect.any(Function);
        } else {
          object[key] = comparable(value);
        }
        return object;
      },
      {}
    ) as T;
  }
  return value;
}
