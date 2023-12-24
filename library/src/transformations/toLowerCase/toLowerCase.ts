import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To lower case transformation type.
 */
export type ToLowerCaseTransformation = BaseTransformation<string> & {
  /**
   * The transformation type.
   */
  type: 'to_lower_case';
};

/**
 * Creates a pipeline transformation action that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation action.
 */
export function toLowerCase(): ToLowerCaseTransformation {
  return {
    type: 'to_lower_case',
    async: false,
    _parse(input) {
      return actionOutput(input.toLocaleLowerCase());
    },
  };
}
