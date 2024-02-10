import { HEXADECIMAL_REGEX } from '../../regex.ts';
import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Hexadecimal validation type.
 */
export type HexadecimalValidation<TInput extends string> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'hexadecimal';
    /**
     * The hexadecimal regex.
     */
    requirement: RegExp;
  };

/**
 * Creates a pipeline validation action that validates a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal).
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function hexadecimal<TInput extends string>(
  message: ErrorMessage = 'Invalid hexadecimal'
): HexadecimalValidation<TInput> {
  return {
    type: 'hexadecimal',
    async: false,
    message,
    requirement: HEXADECIMAL_REGEX,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
