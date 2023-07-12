import { ValiError } from '../../error';
import type { ValidateInfo } from '../../types';

/**
 * Creates a validation functions that validates the size of a map, set or blob.
 *
 * @param requirement The size.
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function size<TInput extends Map<any, any> | Set<any> | Blob>(
  requirement: number,
  error?: string
) {
  return (input: TInput, info: ValidateInfo) => {
    if (input.size !== requirement) {
      throw new ValiError([
        {
          validation: 'size',
          origin: 'value',
          message: error || 'Invalid size',
          input,
          ...info,
        },
      ]);
    }
    return input;
  };
}
