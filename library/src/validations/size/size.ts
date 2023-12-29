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
  message: ErrorMessage = 'Invalid size'
): SizeValidation<TInput, TRequirement> {
  return {
    type: 'size',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.size !== this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
