import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Match validation type.
 */
export type MatchValidation<
  TInput extends string,
  TRequirement extends RegExp
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'match';
  /**
   * The regular expression requirement
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates string against regular expression [RegExp](https://en.wikipedia.org/wiki/Regular_expression).
 *
 * @param requirement regular expression requirement
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function match<TInput extends string, TRequirement extends RegExp>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid string'
): MatchValidation<TInput, TRequirement> {
  return {
    type: 'match',
    async: false,
    message,
    requirement,
    _parse(input) {
      return !this.requirement.test(input)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
