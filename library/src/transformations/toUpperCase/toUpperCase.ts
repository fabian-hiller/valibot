import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To upper case transformation type.
 */
export interface ToUpperCaseTransformation extends BaseTransformation<string> {
  /**
   * The transformation type.
   */
  type: 'to_upper_case';
}

/**
 * Creates a pipeline transformation action that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @returns A transformation action.
 */
export function toUpperCase(): ToUpperCaseTransformation {
  return {
    type: 'to_upper_case',
    async: false,
    _parse(input) {
      return actionOutput(input.toUpperCase());
    },
  };
}
