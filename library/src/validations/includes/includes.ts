import type { ErrorMessage, PipeResult, Validation } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

export function includes<TInput extends string>(
  requirement: string,
  error?: ErrorMessage
): Validation<TInput>;

export function includes<TInput extends TItem[], TItem>(
  requirement: TItem,
  error?: ErrorMessage
): Validation<TInput>;

/**
 * Creates a validation function that validates the content of a string or array.
 *
 * @param requirement The content to be included.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function includes<
  TInput extends string | TItem[],
  TItem,
  const TRequirement extends string | TItem
>(requirement: TRequirement, error?: ErrorMessage) {
  return {
    kind: 'includes' as const,
    message: error ?? 'Invalid content',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return !input.includes(requirement as any)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
