import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Finite validation type.
 */
export interface FiniteValidation<TInput extends number>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'finite';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
}

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
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
