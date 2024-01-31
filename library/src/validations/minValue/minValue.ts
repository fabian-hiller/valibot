import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

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
  message?: ErrorMessage
): MinValueValidation<TInput, TRequirement> {
  return {
    type: 'min_value',
    expects: `>=${
      requirement instanceof Date
        ? requirement.toJSON()
        : stringify(requirement)
    }`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (input >= this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(
        this,
        minValue,
        input,
        'value',
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    },
  };
}

/**
 * See {@link minValue}
 *
 * @deprecated Function has been renamed to `minValue`.
 */
export const minRange = minValue;
