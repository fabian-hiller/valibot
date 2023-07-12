/**
 * Creates a transformation functions that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @returns A transformation functions.
 */
export function toUpperCase() {
  return (input: string) => input.toUpperCase();
}
