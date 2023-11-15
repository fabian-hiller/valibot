import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Max bytes validation type.
 */
export type MaxBytesValidation<
  TInput extends string,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_bytes';
  /**
   * The maximum byte length.
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The maximum byte length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function maxBytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid byte length'
): MaxBytesValidation<TInput, TRequirement> {
  return {
    type: 'max_bytes',
    async: false,
    message,
    requirement,
    _parse(input) {
      return new TextEncoder().encode(input).length > this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
