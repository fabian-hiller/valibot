import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Includes validation type.
 */
export type IncludesValidation<
  TInput extends string | any[],
  TRequirement extends TInput extends any[] ? TInput[number] : TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'includes';
  /**
   * The required value.
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates the content of a string or array.
 *
 * @param requirement The content to be included.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function includes<
  TInput extends string | any[],
  const TRequirement extends TInput extends any[] ? TInput[number] : TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid content'
): IncludesValidation<TInput, TRequirement> {
  return {
    type: 'includes',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !input.includes(requirement)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
