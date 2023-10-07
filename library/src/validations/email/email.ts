import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a email.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    // eslint-disable-next-line security/detect-unsafe-regex -- false positive according to https://devina.io/redos-checker
    !/^[\w+-]+(?:\.[\w+-]+)*@[\da-z]+(?:[.-][\da-z]+)*\.[a-z]{2,}$/iu.test(
      input
    )
      ? getPipeIssues('email', error || 'Invalid email', input)
      : getOutput(input);
}
