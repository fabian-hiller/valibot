/**
 * Creates a transformation functions that converts all the alphabetic
 * characters in a string to lowercase.
 *
 * @returns A transformation functions.
 */
export function toLowerCase() {
  return (input: string) => input.toLocaleLowerCase();
}
