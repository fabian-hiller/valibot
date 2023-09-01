import type { FString, PipeResult } from '../../types.ts';

export function includes<TInput extends string>(
  requirement: string,
  error?: FString
): (input: TInput) => PipeResult<TInput>;

export function includes<TInput extends TItem[], TItem>(
  requirement: TItem,
  error?: FString
): (input: TInput) => PipeResult<TInput>;

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
  error?: FString
) {
  return (input: TInput): PipeResult<TInput> => {
    if (!input.includes(requirement as any)) {
      return {
        issue: {
          validation: 'includes',
          message: error || 'Invalid content',
          input,
        },
      };
    }
    return { output: input };
  };
}
