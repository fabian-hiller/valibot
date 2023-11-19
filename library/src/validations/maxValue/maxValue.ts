import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Max value validation type.
 */
export type MaxValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_value';
  /**
   * The maximum value.
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates the value of a string, number or date.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function maxValue<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid value'
): MaxValueValidation<TInput, TRequirement> {
  return {
    type: 'max_value',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input > this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;
