/*
  Contains all of the characters that are removed by the `trim` method

  This is done so that the runtime and related types are in sync, as there is no trim 
  equivalent in the type system
*/
export const whitespaces = [
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#white_space
  '\t',
  '\v',
  '\f',
  ' ',
  '\u00A0',
  '\uFEFF',
  '\u1680',
  '\u2000',
  '\u2001',
  '\u2002',
  '\u2003',
  '\u2004',
  '\u2005',
  '\u2006',
  '\u2007',
  '\u2008',
  '\u2009',
  '\u200A',
  '\u202F',
  '\u205F',
  '\u3000',
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#line_terminators
  '\n',
  '\r',
  '\u2028',
  '\u2029',
] as const;

const separators: Set<string> = new Set<string>([
  ...whitespaces,
  '_',
  '-',
  '.',
]);

const isSeparator = (ch: string): boolean => separators.has(ch);

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
