import type { JSONSchema7Type } from 'json-schema';
import { isStrictlyJSONCompatible } from './isStrictlyJSONCompatible.ts';

/**
 * Assert value is strict JSON compatible or throw an error
 *
 * @param value        Value to check
 * @param force        Skips assertion
 * @param errorMessage Error message
 *
 * @returns Whether the value is strictly JSON compatible
 */
export function assertJSON(
  value: unknown,
  force: boolean | undefined,
  errorMessage: string
): value is JSONSchema7Type {
  if (!force && !isStrictlyJSONCompatible(value)) throw new Error(errorMessage);
  return true;
}
