import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

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
 * Creates a pipeline validation action that validates the byte length of a
 * string.
 *
 * @param requirement The byte length.
 * @param message The error message.
 *
 * @returns A validation action.
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
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
