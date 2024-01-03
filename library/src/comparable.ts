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
    return comparableArray(value) as T;
  }

  if (value && typeof value === 'object') {
    return comparableObject(value as Record<string, unknown>) as T;
  }

  return value;
}

function comparableArray<T>(array: T[]): T[] {
  return array.map((item) => comparable(item));
}

function comparableObject(
  obj: Record<string, unknown>
): Record<string, unknown> {
  return Object.entries(obj).reduce<Record<string, unknown>>(
    (acc, [key, val]) => {
      if (typeof val === 'function') {
        acc[key] = expect.any(Function);
      } else {
        acc[key] = comparable(val);
      }
      return acc;
    },
    {}
  );
}
