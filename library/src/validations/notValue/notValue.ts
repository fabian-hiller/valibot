import type {
  BaseValidation,
  Comparable,
  ErrorMessage,
  ToComparable,
} from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Not value validation type.
 */
export type NotValueValidation<TRequirement extends Comparable> =
  BaseValidation<ToComparable<TRequirement>> & {
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
 * Creates a pipeline validation action that validates the value of a string,
 * number, bigint, boolean or date.
 *
 * @param requirement The value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function notValue<TRequirement extends Comparable>(
  requirement: TRequirement,
  message?: ErrorMessage
): NotValueValidation<TRequirement> {
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
      // If requirement is fulfilled, return action output
      if (
        // Removing this type assertion,
        // or casting it to ToComparable<TRequirement>
        // will cause a weird error
        input < (this.requirement as Comparable) ||
        input > (this.requirement as Comparable)
      ) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(
        this,
        notValue,
        input,
        'value',
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    },
  };
}
