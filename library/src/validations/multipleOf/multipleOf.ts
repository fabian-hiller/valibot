import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Multiple of validation type.
 */
export interface MultipleOfValidation<
  TInput extends number,
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'multiple_of';
  /**
   * The divisor.
   */
  requirement: TRequirement;
}

/**
 * Creates a pipeline validation action that validates whether a number is a
 * multiple.
 *
 * @param requirement The divisor.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function multipleOf<TInput extends number, TRequirement extends number>(
  requirement: TRequirement,
  message?: ErrorMessage
): MultipleOfValidation<TInput, TRequirement> {
  return {
    type: 'multiple_of',
    expects: `%${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input % this.requirement === 0) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, multipleOf, input, 'multiple', `${input}`);
    },
  };
}
