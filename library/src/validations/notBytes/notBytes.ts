import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Not bytes validation type.
 */
export type NotBytesValidation<
  TInput extends string,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'not_bytes';
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
export function notBytes<TInput extends string, TRequirement extends number>(
  requirement: TRequirement,
  message?: ErrorMessage
): NotBytesValidation<TInput, TRequirement> {
  return {
    type: 'not_bytes',
    expects: `!${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      const length = new TextEncoder().encode(input).length;
      if (length !== this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(this, notBytes, input, 'bytes', `${length}`);
    },
  };
}
