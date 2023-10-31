import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a transformation function that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedStart() {
  return {
    type: 'to_trimmed_start' as const,
    _parse(input: string): PipeResult<string> {
      return getOutput(input.trimStart());
    },
  };
}
