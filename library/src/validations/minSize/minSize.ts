import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min size validation type.
 */
export type MinSizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number,
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'min_size';
  /**
   * The minimum size.
   */
  requirement: TRequirement;
};

/**
 * Creates a pipeline validation action that validates the size of a map, set
 * or blob.
 *
 * @param requirement The minimum size.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function minSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): MinSizeValidation<TInput, TRequirement> {
  return {
    type: 'min_size',
    expects: `>=${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.size >= this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, minSize, input, 'size', `${input.size}`);
    },
  };
}
