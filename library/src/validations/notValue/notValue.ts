import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Not value validation type.
 */
export type NotValueValidation<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'not_value';
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
export function notValue<
  TInput extends string | number | bigint | boolean | Date,
  TRequirement extends TInput
>(
  requirement: TRequirement,
  message?: ErrorMessage
): NotValueValidation<TInput, TRequirement> {
  return {
    type: 'not_value',
    expects: `!${
      requirement instanceof Date
        ? requirement.toJSON()
        : stringify(requirement)
    }`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (input < this.requirement || input > this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(
        this,
        input,
        'value',
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    },
  };
}
