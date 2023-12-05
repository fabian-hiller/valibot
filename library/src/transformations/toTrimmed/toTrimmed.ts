import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To trimmed transformation type.
 */
export type ToTrimmedTransformation = BaseTransformation<string> & {
  /**
   * The transformation type.
   */
  type: 'to_trimmed';
};

/**
 * Creates a transformation function that removes the leading and trailing
 * white space and line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmed(): ToTrimmedTransformation {
  return {
    type: 'to_trimmed',
    async: false,
    _parse(input) {
      return actionOutput(input.trim());
    },
  };
}
