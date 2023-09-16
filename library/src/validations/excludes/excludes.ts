import type { PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

export function excludes<TInput extends string>(
  requirement: string,
  error?: string
): (input: TInput) => PipeResult<TInput>;

export function excludes<TInput extends TItem[], TItem>(
  requirement: TItem,
  error?: string
): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation functions that validates the content of a string or array.
 *
 * @param requirement The content to be excluded.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function excludes<TInput extends string | TItem[], TItem>(
  requirement: string | TItem,
  error?: string
) {
  return (input: TInput): PipeResult<TInput> =>
    input.includes(requirement as any)
      ? getPipeIssues('excludes', error || 'Invalid content', input)
      : getOutput(input);
}
