import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Bytes validation type.
 */
export interface BytesValidation<
  TInput extends string,
  TRequirement extends number
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'bytes';
  /**
   * The byte length.
   */
  requirement: TRequirement;
}

/**
 * Creates a validation function that validates the byte length of a string.
 *
 * @param requirement The byte length.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function bytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid byte length'
): BytesValidation<TInput, TRequirement> {
  return {
    type: 'bytes',
    async: false,
    message,
    requirement,
    _parse(input) {
      return new TextEncoder().encode(input).length !== this.requirement
        ? getPipeIssues(this.type, this.message, input, this.requirement)
        : getOutput(input);
    },
  };
}
