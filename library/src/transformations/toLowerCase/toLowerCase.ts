import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To lower case transformation type.
 */
export interface ToLowerCaseTransformation extends BaseTransformation<string> {
  /**
   * The transformation type.
   */
  type: 'to_lower_case';
}

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation function.
 */
export function toLowerCase(): ToLowerCaseTransformation {
  return {
    type: 'to_lower_case',
    async: false,
    _parse(input) {
      return getOutput(input.toLocaleLowerCase());
    },
  };
}
