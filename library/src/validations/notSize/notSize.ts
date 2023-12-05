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
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The size.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function notSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid size'
): NotSizeValidation<TInput, TRequirement> {
  return {
    type: 'not_size',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.size === this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
