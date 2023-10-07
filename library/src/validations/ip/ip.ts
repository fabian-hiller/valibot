import type { ErrorMessage, PipeResult } from '../../types.ts';
import { getOutput, getPipeIssues } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a IP v4 or v6 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ip<TInput extends string>(error?: ErrorMessage) {
  return (input: TInput): PipeResult<TInput> =>
    // eslint-disable-next-line security/detect-unsafe-regex -- false positive according to https://devina.io/redos-checker
    !/^(?:(?:25[0-5]|(?:2[0-4]|1\d|[1-9])?\d)\.?\b){4}$/u.test(input) &&
    // eslint-disable-next-line security/detect-unsafe-regex -- false positive according to https://devina.io/redos-checker
    !/^(?:(?:[\dA-Fa-f]{1,4}:){7}[\dA-Fa-f]{1,4}|(?:[\dA-Fa-f]{1,4}:){1,7}:|(?:[\dA-Fa-f]{1,4}:){1,6}:[\dA-Fa-f]{1,4}|(?:[\dA-Fa-f]{1,4}:){1,5}(?::[\dA-Fa-f]{1,4}){1,2}|(?:[\dA-Fa-f]{1,4}:){1,4}(?::[\dA-Fa-f]{1,4}){1,3}|(?:[\dA-Fa-f]{1,4}:){1,3}(?::[\dA-Fa-f]{1,4}){1,4}|(?:[\dA-Fa-f]{1,4}:){1,2}(?::[\dA-Fa-f]{1,4}){1,5}|[\dA-Fa-f]{1,4}:(?::[\dA-Fa-f]{1,4}){1,6}|:(?:(?::[\dA-Fa-f]{1,4}){1,7}|:)|fe80:(?::[\dA-Fa-f]{0,4}){0,4}%[\dA-Za-z]+|::(?:f{4}(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|(?:[\dA-Fa-f]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))$/u.test(
      input
    )
      ? getPipeIssues('ip', error || 'Invalid IP', input)
      : getOutput(input);
}
