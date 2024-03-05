import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Length validation type.
 */
export type LengthValidation<
  TInput extends string | any[],
  TRequirement extends number,
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'length';
  /**
   * The length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The length.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function length<
  TInput extends string | any[],
  TRequirement extends number,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): LengthValidation<TInput, TRequirement> {
  return {
    type: 'length',
    expects: `${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.length === this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, length, input, 'length', `${input.length}`);
    },
  };
}
