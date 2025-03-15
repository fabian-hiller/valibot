const separators: Set<string> = new Set<string>([
  '', // represents all whitespaces (trim the character before the membership check)
  '_',
  '-',
  '.',
]);

const isSeparator = (ch: string): boolean => separators.has(ch.trim());

const isUpperCase = (ch: string): boolean =>
  ch === ch.toUpperCase() && ch !== ch.toLowerCase();

type Transformer = (
  ch: string,
  isWordStart: boolean,
  isFirstCh: boolean,
  wasPrevUpperCase: boolean
) => string;

type ToTargetCase = (input: string) => string;

function createToTargetCase(transformer: Transformer): ToTargetCase {
  return function (input) {
    const res: string[] = [];
    let prevCh: string | null = null;
    for (const ch of input) {
      if (!isSeparator(ch)) {
        res.push(
          transformer(
            ch,
            prevCh === null || isSeparator(prevCh),
            res.length === 0,
            prevCh !== null && isUpperCase(prevCh)
          )
        );
      }
      prevCh = ch;
    }
    return res.join('');
  };
}

/**
 * Converts a string to snake case.
 *
 * @param input The string to be converted.
 *
 * @returns The snake case of the input.
 */
export const snakeCase: ToTargetCase = createToTargetCase(
  (ch, isWordStart, isFirstCh, wasPrevUpperCase) => {
    if (isWordStart) {
      return isFirstCh ? ch.toLowerCase() : `_${ch.toLowerCase()}`;
    }
    return isUpperCase(ch)
      ? wasPrevUpperCase
        ? ch.toLowerCase()
        : `_${ch.toLowerCase()}`
      : ch;
  }
);
