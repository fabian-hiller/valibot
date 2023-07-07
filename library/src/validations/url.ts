import { ValiError } from '../error';
import type { ValidateInfo } from '../types';

/**
 * Creates a validation functions that validates a URL.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function url<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    try {
      new URL(input);
      return input;
    } catch (_) {
      throw new ValiError([
        {
          validation: 'url',
          origin: 'value',
          message: error || 'Invalid URL',
          input,
          ...info,
        },
      ]);
    }
  };
}
