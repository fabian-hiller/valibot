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
 * Creates a validation function that validates whether a number is a multiple.
 *
 * @param requirement The divisor.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function multipleOf<TInput extends number, TRequirement extends number>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid multiple'
): MultipleOfValidation<TInput, TRequirement> {
  return {
    type: 'multiple_of',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input % this.requirement !== 0
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
