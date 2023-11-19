import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Custom validation type.
 */
export type CustomValidation<TInput> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'custom';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
};

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  message: ErrorMessage = 'Invalid input'
): CustomValidation<TInput> {
  return {
    type: 'custom',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !this.requirement(input)
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
