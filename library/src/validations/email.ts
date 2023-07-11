import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a email.
 *
 * Hint: The regex used is not perfect, but should work for most emails.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function email<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
        input
      )
    ) {
      throw new ValiError([
        {
          validation: 'email',
          origin: 'value',
          message: error || 'Invalid email',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
