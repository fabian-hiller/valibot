import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Bytes validation type.
 */
export type BytesValidation<
  TInput extends string,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'bytes';
  /**
   * The byte length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the bytes of a string.
 *
 * @param requirement The bytes.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function bytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message?: ErrorMessage
): BytesValidation<TInput, TRequirement> {
  return {
    type: 'bytes',
    expects: `${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // Calculate byte length
      const length = new TextEncoder().encode(input).length;

      // If requirement is fulfilled, return action output
      if (length === this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, bytes, input, 'bytes', `${length}`);
    },
  };
}
