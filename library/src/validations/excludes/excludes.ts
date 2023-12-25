import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Excludes validation type.
 */
export type ExcludesValidation<
  TInput extends string | any[],
  TRequirement extends TInput extends any[] ? TInput[number] : TInput
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'excludes';
  /**
   * The required value.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the content of a string
 * or array.
 *
 * @param requirement The content to be excluded.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function excludes<
  TInput extends string | any[],
  const TRequirement extends TInput extends any[] ? TInput[number] : TInput
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid content'
): ExcludesValidation<TInput, TRequirement> {
  return {
    type: 'excludes',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.includes(this.requirement)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
