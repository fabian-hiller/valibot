import type { ParseResult } from '../../types.ts';

/**
 * Creates a transformation function that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation function.
 */
export function toTrimmedStart() {
  return (input: string): ParseResult<string> => ({
    output: input.trimStart(),
  });
}
