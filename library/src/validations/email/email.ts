import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation function that validates an email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: ErrorMessage) {
  return {
    kind: 'email' as const,
    message: error ?? 'Invalid email',
    requirement:
      /^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/i,
    _parse(input: TInput): PipeResult<TInput> {
      return !this.requirement.test(input)
        ? getPipeIssues(this.kind, this.message, input)
        : getOutput(input);
    },
  };
}
