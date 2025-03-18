/**
 * An array of all of the characters that are removed by the `trim` method.
 */
const whitespaces = [
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

/**
 * An array of all characters that are considered separators for case transforms.
 */
export const separators: readonly [...typeof whitespaces, '_', '-', '.'] = [
  ...whitespaces,
  '_',
  '-',
  '.',
];
