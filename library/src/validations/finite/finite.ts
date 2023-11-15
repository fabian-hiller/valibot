import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Finite validation type.
 */
export type FiniteValidation<TInput extends number> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'finite';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a validation function that validates whether a number is finite.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function finite<TInput extends number>(
  message: ErrorMessage = 'Invalid finite number'
): FiniteValidation<TInput> {
  return {
    type: 'finite',
    async: false,
    message,
    requirement: Number.isFinite,
    _parse(input: TInput) {
      return !this.requirement(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
