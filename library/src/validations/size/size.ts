import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Size validation type.
 */
export type SizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'size';
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
export function size<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
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
      if (input.size === this.requirement) {
        return actionOutput(input);
      }
      return actionIssue(this, input, 'size', `${input.size}`);
    },
  };
}
