/**
 * Creates a transformation function that converts all the alphabetic
 * characters in a string to uppercase.
 *
 * @returns A transformation function.
 */
export function toUpperCase() {
  return (input: string) => input.toUpperCase();
}
