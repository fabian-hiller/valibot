import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To trimmed transformation type.
 */
export interface ToTrimmedTransformation extends BaseTransformation<string> {
  /**
   * The transformation type.
   */
  type: 'to_trimmed';
}

/**
 * Creates a pipeline transformation action that removes the leading and
 * trailing white space and line terminator characters from a string.
 *
 * @returns A transformation action.
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
