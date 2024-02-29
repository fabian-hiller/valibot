import type {
  BaseValidation,
  Comparable,
  ErrorMessage,
  ToComparable,
} from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Value validation type.
 */
export type ValueValidation<TRequirement extends Comparable> = BaseValidation<
  ToComparable<TRequirement>
> & {
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
 * Creates a pipeline validation action that validates the value of a string,
 * number, boolean or date.
 *
 * @param requirement The value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function value<TRequirement extends Comparable>(
  requirement: TRequirement,
  message?: ErrorMessage
): ValueValidation<TRequirement> {
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
      if (
        // Removing this type assertion,
        // or casting it to ToComparable<TRequirement>
        // will cause a weird error
        input <= (this.requirement as Comparable) &&
        input >= (this.requirement as Comparable)
      ) {
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
