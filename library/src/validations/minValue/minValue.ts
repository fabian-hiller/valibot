import type {
  BaseValidation,
  ErrorMessage,
  MinMaxValueIO,
  ToMinMaxValueIO,
} from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Min value validation type.
 */
export type MinValueValidation<TRequirement extends MinMaxValueIO> =
  BaseValidation<ToMinMaxValueIO<TRequirement>> & {
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
export function minValue<TRequirement extends MinMaxValueIO>(
  requirement: TRequirement,
  message?: ErrorMessage
): MinValueValidation<TRequirement> {
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
      // If requirement is fulfilled, return action output
      if (
        input >=
        // Removing this type assertion,
        // or casting it to ToMinMaxValueIO<TRequirement>
        // will cause a weird error
        (this.requirement as MinMaxValueIO)
      ) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
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
