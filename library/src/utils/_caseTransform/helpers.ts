import { separators } from './constants.ts';

const separatorsSt: Set<string> = new Set<string>(separators);

/**
 * Checks if a character is a separator.
 *
 * @param ch The character to check.
 *
 * @returns whether the character is a separator.
 */
export const _isSeparator = (ch: string): boolean => separatorsSt.has(ch);

/**
 * Checks if a character is in its uppercase form.
 *
 * @param ch The character to check.
 *
 * @returns whether the character is in its uppercase form.
 */
export const _isUpperCase = (ch: string): boolean =>
  ch === ch.toUpperCase() && ch !== ch.toLowerCase();
