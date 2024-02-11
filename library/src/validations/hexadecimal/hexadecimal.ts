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
  message?: ErrorMessage
): HexadecimalValidation<TInput> {
  return {
    type: 'hexadecimal',
    expects: null,
    async: false,
    message,
    requirement: HEXADECIMAL_REGEX,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement.test(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, hexadecimal, input, 'hexadecimal');
    },
  };
}
