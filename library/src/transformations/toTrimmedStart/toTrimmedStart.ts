/**
 * Creates a transformation functions that removes the leading white space and
 * line terminator characters from a string.
 *
 * @returns A transformation functions.
 */
export function toTrimmedStart() {
  return (input: string) => input.trimStart();
}
