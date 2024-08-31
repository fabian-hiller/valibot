import { deepEqual } from './deepEqual.ts';

/**
 * Check if a value is strictly JSON compatible.
 * Ensuring that it serializes to JSON and that it deserializes to the exact same value.
 *
 * @param value Value to check
 *
 * @returns Whether the value is strictly JSON compatible or not
 */
export function isStrictlyJSONCompatible(value: unknown): boolean {
  try {
    const json = JSON.stringify(value);
    if (!json) return false;
    return deepEqual(value, JSON.parse(json));
  } catch (e) {
    return false;
  }
}
