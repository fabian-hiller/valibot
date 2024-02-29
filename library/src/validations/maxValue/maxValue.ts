import type {
  BaseValidation,
  ErrorMessage,
  MinMaxValueIO,
  ToMinMaxValueIO,
} from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Max value validation type.
 */
export type MaxValueValidation<TRequirement extends MinMaxValueIO> =
  BaseValidation<ToMinMaxValueIO<TRequirement>> & {
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
 * Creates a pipeline validation action that validates the value of a string,
 * number, boolean or date.
 *
 * @param requirement The maximum value.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function maxValue<TRequirement extends MinMaxValueIO>(
  requirement: TRequirement,
  message?: ErrorMessage
): MaxValueValidation<TRequirement> {
  return {
    type: 'max_value',
    expects: `<=${
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
        input <=
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
        maxValue,
        input,
        'value',
        input instanceof Date ? input.toJSON() : stringify(input)
      );
    },
  };
}

/**
 * See {@link maxValue}
 *
 * @deprecated Function has been renamed to `maxValue`.
 */
export const maxRange = maxValue;
