import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

/**
 * To trimmed end transformation type.
 */
export interface ToTrimmedEndTransformation extends BaseTransformation<string> {
  /**
   * The transformation type.
   */
  type: 'to_trimmed_end';
}

/**
 * Creates a transformation function that removes the trailing white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedEnd(): ToTrimmedEndTransformation {
  return {
    type: 'to_trimmed_end',
    async: false,
    _parse(input) {
      return actionOutput(input.trimEnd());
    },
  };
}
