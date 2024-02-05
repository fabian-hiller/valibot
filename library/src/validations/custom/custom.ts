import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Custom validation type.
 */
export interface CustomValidation<TInput> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'custom';
  /**
   * The validation function.
   */
  requirement: (input: TInput) => boolean;
}

/**
 * Creates a custom pipeline validation action.
 *
 * @param requirement The validation function.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  message?: ErrorMessage
): CustomValidation<TInput> {
  return {
    type: 'custom',
    expects: null,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (this.requirement(input)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, custom, input, 'input');
    },
  };
}
