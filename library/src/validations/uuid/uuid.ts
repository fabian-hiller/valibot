import { ValiError } from '../../error/index.ts';
import type { ValidateInfo } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a validation functions that validates a UUID.
 *
 * @param error The error message.
 *
 * @returns A validation function.
 */
export function uuid<TInput extends string>(error?: string) {
  return (input: TInput, info: ValidateInfo) => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input
      )
    ) {
      throw new ValiError([
        getIssue(info, {
          validation: 'uuid',
          message: error || 'Invalid UUID',
          input,
        }),
      ]);
    }
    return input;
  };
}
