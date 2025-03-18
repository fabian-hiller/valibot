import { _createToTargetCase, _isUpperCase } from '../_caseTransform/index.ts';

/**
 * Converts a string to snake case.
 *
 * @param input The string to be converted.
 *
 * @returns The snake case of the input.
 */
export const _snakeCase: (input: string) => string = _createToTargetCase(
  (ch, isWordStart, isFirstCh, wasPrevUpperCase) => {
    if (isWordStart) {
      return isFirstCh ? ch.toLowerCase() : `_${ch.toLowerCase()}`;
    }
    return _isUpperCase(ch)
      ? wasPrevUpperCase
        ? ch.toLowerCase()
        : `_${ch.toLowerCase()}`
      : ch;
  }
);
