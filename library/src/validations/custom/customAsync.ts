import type { BaseValidationAsync, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Custom validation async type.
 */
export interface CustomValidationAsync<TInput>
  extends BaseValidationAsync<TInput> {
  /**
   * The validation type.
   */
  type: 'custom';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => Promise<boolean>;
}

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param message The error message.
 *
 * @returns A async validation function.
 */
export function customAsync<TInput>(
  requirement: (input: TInput) => Promise<boolean>,
  message: ErrorMessage = 'Invalid input'
): CustomValidationAsync<TInput> {
  return {
    type: 'custom',
    async: true,
    message,
    requirement,
    async _parse(input) {
      return !(await this.requirement(input))
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
