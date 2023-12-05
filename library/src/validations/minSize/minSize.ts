import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Min size validation type.
 */
export type MinSizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
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
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The minimum size.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function minSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid size'
): MinSizeValidation<TInput, TRequirement> {
  return {
    type: 'min_size',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.size < this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
