/**
 * Converts a string to snake case.
 *
 * @param input The string to be converted.
 *
 * @returns The snake case of the input.
 */
export function snakeCase(input: string): string {
  const res: string[] = [];
  let wasPrevChUpperCase = false;
  for (const ch of input.trimStart()) {
    const lowerCaseCh = ch.toLowerCase();
    const isWhiteSpace = ch.trim() === '';
    const isSeparator = isWhiteSpace || ch === '_' || ch === '-' || ch === '.';
    const isUpperCase = ch === ch.toUpperCase() && ch !== lowerCaseCh;
    if (isSeparator) {
      if (res.length > 0 && res[res.length - 1] !== '_') {
        res.push('_');
      }
    } else if (isUpperCase) {
      if (
        res.length > 0 &&
        res[res.length - 1] !== '_' &&
        !wasPrevChUpperCase
      ) {
        res.push('_');
      }
      res.push(lowerCaseCh);
    } else {
      res.push(ch);
    }
    wasPrevChUpperCase = isUpperCase;
  }
  if (res.length > 0 && res[res.length - 1] === '_') {
    res.pop();
  }
  return res.join('');
}
