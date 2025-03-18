import { _isSeparator, _isUpperCase } from './helpers.ts';

type Transformer = (
  ch: string,
  isWordStart: boolean,
  isFirstCh: boolean,
  wasPrevUpperCase: boolean
) => string;

type ToTargetCase = (input: string) => string;

/**
 * Creates a case transformer.
 *
 * @param transformer A function to customize the case transformation logic.
 *
 * @returns A function that transforms a string to a specific case.
 */
export function _createToTargetCase(transformer: Transformer): ToTargetCase {
  return function (input) {
    const res: string[] = [];
    let prevCh: string | null = null;
    for (const ch of input) {
      if (!_isSeparator(ch)) {
        res.push(
          transformer(
            ch,
            prevCh === null || _isSeparator(prevCh),
            res.length === 0,
            prevCh !== null && _isUpperCase(prevCh)
          )
        );
      }
      prevCh = ch;
    }
    return res.join('');
  };
}
