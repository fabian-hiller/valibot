import type { separators } from './constants.ts';

type Separator = (typeof separators)[number];

/**
 * Checks if a string type is a separator.
 */
export type IsSeparator<T extends string> = T extends Separator ? true : false;

/**
 * Checks if a string is in its uppercase form.
 */
export type IsUpperCase<T extends string> =
  T extends Uppercase<T> ? (T extends Lowercase<T> ? false : true) : false;

/**
 * Checks if a string is empty.
 */
export type IsEmpty<T extends string> = T extends '' ? true : false;

/**
 * Checks if a character is the first character of a word based on the previous character.
 */
export type IsWordStart<TPrevCh extends string | null> = [TPrevCh] extends [
  string,
]
  ? IsSeparator<TPrevCh>
  : true;

/**
 * Checks if a nullable character is in its uppercase form.
 */
export type WasPrevUpperCase<TPrevCh extends string | null> = [
  TPrevCh,
] extends [string]
  ? IsUpperCase<TPrevCh>
  : false;
