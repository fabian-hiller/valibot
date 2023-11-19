import type { BaseTransformation } from '../../types/index.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * To trimmed start transformation type.
 */
export interface ToTrimmedStartTransformation
  extends BaseTransformation<string> {
  /**
   * The transformation type.
   */
  type: 'to_trimmed_start';
}

/**
 * Creates a transformation function that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedStart(): ToTrimmedStartTransformation {
  return {
    type: 'to_trimmed_start',
    async: false,
    _parse(input) {
      return getOutput(input.trimStart());
    },
  };
}
