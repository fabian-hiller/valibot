import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min value validation type.
 */
export type MinValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'min_value';
  /**
   * The minimum value.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the value of a string,
 * number or date.
 *
 * @param requirement The minimum value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function minValue<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid value'
): MinValueValidation<TInput, TRequirement> {
  return {
    type: 'min_value',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input < this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

/**
 * See {@link minValue}
 *
 * @deprecated Function has been renamed to `minValue`.
 */
export const minRange = minValue;
