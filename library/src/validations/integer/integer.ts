import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Integer validation type.
 */
export type IntegerValidation<TInput extends number> =
  BaseValidation<TInput> & {
    /**
     * The validation type.
     */
    type: 'integer';
    /**
     * The validation function.
     */
    requirement: (input: TInput) => boolean;
  };

/**
 * Creates a pipeline validation action that validates whether a number is an
 * integer.
 *
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function integer<TInput extends number>(
  message: ErrorMessage = 'Invalid integer'
): IntegerValidation<TInput> {
  return {
    type: 'integer',
    async: false,
    message,
    requirement: Number.isInteger,
    _parse(input) {
      return !this.requirement(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
