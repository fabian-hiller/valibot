import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Equal validation type.
 */
export type EqualValidation<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput,
> = BaseValidation<TInput> & {
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
export function equal<
  TInput extends string | number | bigint | boolean,
  TRequirement extends TInput,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): EqualValidation<TInput, TRequirement> {
  return {
    type: 'equal',
    expects: stringify(requirement),
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input === this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, equal, input, 'value');
    },
  };
}
