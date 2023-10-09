import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

export function includes<TInput extends string>(
  requirement: string,
  error?: ErrorMessage
): (input: TInput) => PipeResult<TInput>;

export function includes<TInput extends TItem[], TItem>(
  requirement: TItem,
  error?: ErrorMessage
): (input: TInput) => PipeResult<TInput>;

/**
 * Creates a validation functions that validates the content of a string or array.
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
  const kind = 'includes' as const;
  const message = error ?? ('Invalid content' as const);
  return Object.assign(
    (input: TInput): PipeResult<TInput> =>
      !input.includes(requirement as any)
        ? getPipeIssues(kind, message, input)
        : getOutput(input),
    {
      kind,
      requirement,
      message,
    }
  );
}
