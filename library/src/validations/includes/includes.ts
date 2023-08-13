import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

export function includes<TInput extends string>(
  requirement: string,
  error?: string
): (input: TInput, info: ValidateInfo) => TInput;

export function includes<TInput extends TItem[], TItem>(
  requirement: TItem,
  error?: string
): (input: TInput, info: ValidateInfo) => TInput;

/**
 * Creates a validation functions that validates the content of a string or array.
 *
 * @param requirement The content to be included.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function includes<TInput extends string | TItem[], TItem>(
  requirement: string | TItem,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!input.includes(requirement as any)) {
      throw new ValiError([
        getIssue(info, {
          validation: 'includes',
          message: error || 'Invalid content',
          input,
        }),
      ]);
    }
    return input;
  };
}
