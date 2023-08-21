import type { _ParseResult } from '../../types.ts';

/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation function.
 */
export function toLowerCase() {
  return (input: string): _ParseResult<string> => ({
    output: input.toLocaleLowerCase(),
  });
}
