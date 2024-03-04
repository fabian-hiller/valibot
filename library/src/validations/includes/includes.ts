import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput, stringify } from '../../utils/index.ts';

/**
 * Includes validation type.
 */
export interface IncludesValidation<
  TInput extends string | any[],
  TRequirement extends TInput extends any[] ? TInput[number] : TInput
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'includes';
  /**
   * The required value.
   */
  requirement: TRequirement;
}

/**
 * Creates a pipeline validation action that validates the content of a string
 * or array.
 *
 * @param requirement The content to be included.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function includes<
  TInput extends string | any[],
  const TRequirement extends TInput extends any[] ? TInput[number] : TInput,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): IncludesValidation<TInput, TRequirement> {
  const expects = stringify(requirement);
  return {
    type: 'includes',
    expects,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.includes(this.requirement)) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, includes, input, 'content', `!${expects}`);
    },
  };
}
