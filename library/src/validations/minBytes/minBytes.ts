import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min bytes validation type.
 */
export type MinBytesValidation<
  TInput extends string,
  TRequirement extends number,
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'min_bytes';
  /**
   * The minimum byte length.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the bytes of a string.
 *
 * @param requirement The minimum bytes.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function minBytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message?: ErrorMessage
): MinBytesValidation<TInput, TRequirement> {
  return {
    type: 'min_bytes',
    expects: `>=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // Calculate byte length
      const length = new TextEncoder().encode(input).length;

      // If requirement is fulfilled, return action output
      if (length >= this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, minBytes, input, 'bytes', `${length}`);
    },
  };
}
