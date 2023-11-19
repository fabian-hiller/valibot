import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

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
 * Creates a validation function that validates whether a number is an integer.
 *
 * @param message The error message.
 *
 * @returns A validation function.
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
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
