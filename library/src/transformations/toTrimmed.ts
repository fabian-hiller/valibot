/**
 * Creates a transformation functions that removes the leading and trailing
 * white space and line terminator characters from a string.
 *
 * @returns A transformation functions.
 */
export function toTrimmed() {
  return (input: string) => input.trim();
}
