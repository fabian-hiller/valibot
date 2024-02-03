import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Value validation type.
 */
export type ValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'value';
  /**
   * The value.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the value of a string
 * or number.
 *
 * @param requirement The value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function value<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message?: ErrorMessage
): ValueValidation<TInput, TRequirement> {
  return {
    type: 'value',
    expects: `${
      requirement instanceof Date
        ? requirement.toJSON()
        : stringify(requirement)
    }`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input <= this.requirement && input >= this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(
        this,
        value,
        input,
        'value',
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    },
  };
}
