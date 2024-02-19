import type { BaseValidationAsync, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Custom validation async type.
 */
export type CustomValidationAsync<TInput> = BaseValidationAsync<TInput> & {
  /**
   * The validation type.
   */
  type: 'custom';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => Promise<boolean>;
};

/**
 * Creates a async custom validation function.
 *
 * @param requirement The async validation function.
 * @param message The error message.
 *
 * @returns A async validation action.
 */
export function customAsync<TInput>(
  requirement: (input: TInput) => Promise<boolean>,
  message?: ErrorMessage
): CustomValidationAsync<TInput> {
  return {
    type: 'custom',
    expects: null,
    async: true,
    message,
    requirement,
    async _parse(input) {
      // If requirement is fulfilled, return action output
      if (await this.requirement(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, customAsync, input, 'input');
    },
  };
}
