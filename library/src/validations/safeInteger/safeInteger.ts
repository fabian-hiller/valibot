import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Safe integer validation type.
 */
export interface SafeIntegerValidation<TInput extends number>
  extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'safe_integer';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
}

/**
 * Creates a validation function that validates whether a number is a safe integer.
 *
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function safeInteger<TInput extends number>(
  message: ErrorMessage = 'Invalid safe integer'
): SafeIntegerValidation<TInput> {
  return {
    type: 'safe_integer',
    async: false,
    message,
    requirement: Number.isSafeInteger,
    _parse(input) {
      return !this.requirement(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
