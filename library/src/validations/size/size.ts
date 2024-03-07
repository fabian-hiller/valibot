import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Size validation type.
 */
export interface SizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number,
> extends BaseValidation<TInput> {
  /**
   * The validation type.
   */
  type: 'size';
  /**
   * The size.
   */
  requirement: TRequirement;
}

/**
 * Creates a pipeline validation action that validates the size of a map, set
 * or blob.
 *
 * @param requirement The size.
 * @param message The error message.
 *
 * @returns A validation action.
 */
export function size<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number,
>(
  requirement: TRequirement,
  message?: ErrorMessage
): SizeValidation<TInput, TRequirement> {
  return {
    type: 'size',
    expects: `${requirement}`,
    async: false,
    message,
    requirement,
    _parse(input) {
      // If requirement is fulfilled, return action output
      if (input.size === this.requirement) {
        return actionOutput(input);
      }

      // Otherwise, return action issue
      return actionIssue(this, size, input, 'size', `${input.size}`);
    },
  };
}
