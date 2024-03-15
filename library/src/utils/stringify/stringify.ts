/**
 * Stringifies an unknown input to a literal or type string.
 *
 * @param input The unknown input.
 *
 * @returns A literal or type string.
 */
export function stringify(input: unknown): string {
  let type = typeof input;
  if (type === 'object') {
    type = input ? Object.getPrototypeOf(input).constructor.name : 'null';
  }
  return type === 'string'
    ? `"${input}"`
    : type === 'number' || type === 'bigint' || type === 'boolean'
      ? `${input}`
      : type;
}
