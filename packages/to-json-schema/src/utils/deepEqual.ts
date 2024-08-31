/**
 * Minimal recursive deep equal of JS values.
 *
 * @param value1 Value to compare
 * @param value2 Value to compare
 *
 * @returns Whether the values are equal or not
 */
export function deepEqual(value1: unknown, value2: unknown): boolean {
  if (value1 === value2) return true;
  if (
    value1 instanceof Object &&
    value2 instanceof Object &&
    Object.getPrototypeOf(value1) === Object.getPrototypeOf(value2)
  ) {
    const keys1 = Reflect.ownKeys(value1);
    const keys2 = Reflect.ownKeys(value2);
    if (keys1.length !== keys2.length) return false;
    // @ts-expect-error
    return keys1.every((key1) => deepEqual(value1[key1], value2[key1]));
  }
  return false;
}
