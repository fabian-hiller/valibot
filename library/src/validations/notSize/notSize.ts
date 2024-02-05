import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Not size validation type.
 */
export type NotSizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'not_size';
  /**
   * The size.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the size of a map, set
 * or blob.
 *
 * @param requirement The size.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function notSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
>(
  requirement: TRequirement,
  message?: ErrorMessage
): NotSizeValidation<TInput, TRequirement> {
  return {
    type: 'not_size',
    expects: `!${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.size !== this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, notSize, input, 'size', `${input.size}`);
    },
  };
}
