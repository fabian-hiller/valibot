const snakeCaseSeparator = '_';

const separators = new Set([
  '', // represents all whitespaces (trim the character before performing the membership check)
  snakeCaseSeparator,
  '-',
  '.',
]);

const isSeparator = (ch: string) => separators.has(ch.trim());

const isUpperCase = (ch: string) =>
  ch === ch.toUpperCase() && ch !== ch.toLowerCase();

const isNotEmpty = (arr: readonly unknown[]) => arr.length > 0;

const isTopSnakeCaseSeparator = (chs: readonly string[]) =>
  chs.at(-1) === snakeCaseSeparator;

/**
 * Converts a string to snake case.
 *
 * @param input The string to be converted.
 *
 * @returns The snake case of the input.
 */
export function snakeCase(input: string): string {
  const res: string[] = [];
  let wasPrevUpperCase = false;
  for (const ch of input.trimStart()) {
    const isCurUpperCase = isUpperCase(ch);
    if (isCurUpperCase) {
      if (
        isNotEmpty(res) &&
        !isTopSnakeCaseSeparator(res) &&
        !wasPrevUpperCase
      ) {
        res.push(snakeCaseSeparator);
      }
      res.push(ch.toLowerCase());
    } else if (!isSeparator(ch)) {
      // `ch` is a lowercase character
      res.push(ch);
    }
    // `ch` is a separator
    else if (isNotEmpty(res) && !isTopSnakeCaseSeparator(res)) {
      res.push(snakeCaseSeparator);
    }
    wasPrevUpperCase = isCurUpperCase;
  }
  if (isTopSnakeCaseSeparator(res)) {
    res.pop();
  }
  return res.join('');
}
