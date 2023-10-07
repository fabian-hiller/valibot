import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    // eslint-disable-next-line security/detect-unsafe-regex -- false positive according to https://devina.io/redos-checker
    !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu.test(input)
      ? getPipeIssues('uuid', error || 'Invalid UUID', input)
      : getOutput(input);
}
