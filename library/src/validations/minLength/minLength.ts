import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min length validation type.
 */
export type MinLengthValidation<
  TInput extends string | number | any[],
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'min_length';
  /**
   * The minimum length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the length of a string, number
 * or array.
 *
 * @param requirement The minimum length.
 * @param message The error message.
 *
 * @returns A validation action.
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
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
