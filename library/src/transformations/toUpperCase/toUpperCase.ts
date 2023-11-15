import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To upper case transformation type.
 */
export type ToUpperCaseTransformation = BaseTransformation<string> & {
  /**
   * The transformation type.
   */
  type: 'to_upper_case';
};

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @returns A transformation function.
 */
export function toUpperCase(): ToUpperCaseTransformation {
  return {
    type: 'to_upper_case',
    async: false,
    _parse(input) {
      return getOutput(input.toUpperCase());
    },
  };
}
