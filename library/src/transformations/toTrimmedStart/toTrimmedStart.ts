import type { PipeResult } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';

/**
 * Creates a transformation function that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedStart() {
  return (input: string): PipeResult<string> => getOutput(input.trimStart());
}
