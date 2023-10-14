import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a transformation function that removes the leading and trailing
 * white space and line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmed() {
  return {
    kind: 'to_trimmed' as const,
    _parse(input: string): PipeResult<string> {
      return getOutput(input.trim());
    },
  };
}
