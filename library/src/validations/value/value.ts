import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Value validation type.
 */
export interface ValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'value';
  /**
   * The value.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the value of a string or number.
 *
 * @param requirement The value.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function value<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid value'
): ValueValidation<TInput, TRequirement> {
  return {
    type: 'value',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input !== this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
