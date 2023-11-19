import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Min length validation type.
 */
export interface MinLengthValidation<
  TInput extends string | any[],
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'min_length';
  /**
   * The minimum length.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The minimum length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function minLength<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid length'
): MinLengthValidation<TInput, TRequirement> {
  return {
    type: 'min_length',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.length < this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
