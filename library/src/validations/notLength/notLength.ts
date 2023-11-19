import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Not length validation type.
 */
export interface NotLengthValidation<
  TInput extends string | any[],
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'not_length';
  /**
   * The length.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function notLength<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid length'
): NotLengthValidation<TInput, TRequirement> {
  return {
    type: 'not_length',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.length === this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
