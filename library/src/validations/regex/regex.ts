import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates a string with a regex.
 *
 * @param requirement The regex pattern.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function regex<TInput extends string>(
  requirement: RegExp,
  error?: ErrorMessage
) {
  return {
    type: 'regex' as const,
    message: error ?? 'Invalid regex',
    requirement,
    _parse(input: TInput): PipeResult<TInput> {
      return !requirement.test(input)
        ? getPipeIssues(this.type, this.message, input)
        : getOutput(input);
    },
  };
}
