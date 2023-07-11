/**
 * Creates a transformation functions that removes the trailing white space and
 * line terminator characters from a string.
 *
 * @returns A transformation functions.
 */
export function toTrimmedEnd() {
  return (input: string) => input.trimEnd();
}
