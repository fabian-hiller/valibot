import type { FString, PipeResult } from '../../types.ts';

/**
 * Creates a validation functions that validates a IP v4 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ipv4<TInput extends string>(error?: FString) {
  return (input: TInput): PipeResult<TInput> => {
    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(input)) {
      return {
        issue: {
          validation: 'ipv4',
          message: error || 'Invalid IP v4',
          input,
        },
      };
    }
    return { output: input };
  };
}
