import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a transformation function that removes the trailing white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedEnd() {
  return {
    type: 'to_trimmed_end' as const,
    _parse(input: string): PipeResult<string> {
      return getOutput(input.trimEnd());
    },
  };
}
