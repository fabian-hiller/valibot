import type {
  BaseValidation,
  Comparable,
  ErrorMessage,
  ToComparable,
} from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

type EqualComparable = Exclude<Comparable, Date>;

/**
 * Equal validation type.
 */
export type EqualValidation<TRequirement extends EqualComparable> =
  BaseValidation<ToComparable<TRequirement>> & {
    /**
     * The validation type.
     */
    type: 'equal';
    /**
     * The required value.
     */
    requirement: TRequirement;
  };

/**
 * Creates a pipeline validation action that checks the value for equality.
 *
 * @deprecated Function has been renamed to `value`.
 *
 * @param requirement The required value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function equal<TRequirement extends EqualComparable>(
  requirement: TRequirement,
  message?: ErrorMessage
): EqualValidation<TRequirement> {
  return {
    type: 'equal',
    expects: stringify(requirement),
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (
        input ===
        // Removing this type assertion,
        // or casting it to ToComparable<TRequirement>
        // will cause a weird error
        (this.requirement as EqualComparable)
      ) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, equal, input, 'value');
    },
  };
}
