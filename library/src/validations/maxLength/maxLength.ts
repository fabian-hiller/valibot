import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Max length validation type.
 */
export interface MaxLengthValidation<
  TInput extends string | any[],
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'max_length';
  /**
   * The maximum length.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The maximum length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function maxLength<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid length'
): MaxLengthValidation<TInput, TRequirement> {
  return {
    type: 'max_length',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.length > this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
