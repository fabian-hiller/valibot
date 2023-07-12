import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a validation functions that validates a IP v4 address.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function ipv4<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(input)) {
      throw new ValiError([
        {
          validation: 'ipv4',
          origin: 'value',
          message: error || 'Invalid IP v4',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
