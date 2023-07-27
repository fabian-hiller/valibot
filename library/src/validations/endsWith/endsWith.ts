import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';

/**
 * Creates a validation functions that validates the end of a string.
 *
 * @param requirement The end string.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function endsWith<TInput extends string>(
  requirement: string,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (!input.endsWith(requirement as any)) {
      throw new ValiError([
        {
          validation: 'ends_with',
          origin: 'value',
          message: error || 'Invalid end',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
