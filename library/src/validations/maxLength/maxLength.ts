import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Max length validation type.
 */
export type MaxLengthValidation<
  TInput extends string | any[],
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_length';
  /**
   * The maximum length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the length of a string
 * or array.
 *
 * @param requirement The maximum length.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function maxLength<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message?: ErrorMessage
): MaxLengthValidation<TInput, TRequirement> {
  return {
    type: 'max_length',
    expects: `<=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      if (input.length <= this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'length', `${input.length}`);
    },
  };
}
