import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a custom validation function.
 *
 * @param requirement The validation function.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function custom<TInput>(
  requirement: (input: TInput) => boolean,
  error?: ErrorMessage
) {
  return {
    type: 'custom' as const,
    message: error ?? 'Invalid input',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return !requirement(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
