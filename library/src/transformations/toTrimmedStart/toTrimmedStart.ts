import type { BaseTransformation } from '../../types/index.ts';
import { actionOutput } from '../../utils/index.ts';

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
 * Creates a pipeline transformation action that removes the leading white
 * space and line terminator characters from a string.
 *
 * @returns A transformation action.
 */
export function toTrimmedStart(): ToTrimmedStartTransformation {
  return {
    type: 'to_trimmed_start',
    async: false,
    _parse(input) {
      return actionOutput(input.trimStart());
    },
  };
}
