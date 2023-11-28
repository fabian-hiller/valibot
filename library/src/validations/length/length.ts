import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Length validation type.
 */
export type LengthValidation<
  TInput extends string | any[],
  TRequirement extends number
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
 * Creates a validation function that validates the length of a string or array.
 *
 * @param requirement The length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function length<
  TInput extends string | any[],
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid length'
): LengthValidation<TInput, TRequirement> {
  return {
    type: 'length',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.length !== this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
