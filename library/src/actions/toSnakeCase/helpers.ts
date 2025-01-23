/**
 * Converts a string to snake case.
 *
 * @param input The string to be converted.
 * @returns The snake case of the input.
 */
export function snakeCase(input: string): string {
  const res: string[] = [];
  for (const ch of input) {
    let lowerCaseCh: string;
    res.push(
      res.length > 0 &&
        ch === ch.toUpperCase() &&
        ch !== (lowerCaseCh = ch.toLowerCase())
        ? `_${lowerCaseCh}`
        : ch
    );
  }
  return res.join('');
}
