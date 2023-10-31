import type { BaseSchema, ErrorMessage } from '../../types.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema type.
 */
export type NeverSchema = BaseSchema<never> & {
  type: 'never';
};

/**
 * Creates a never schema.
 *
 * @param error The error message.
 *
 * @returns A never schema.
 */
export function never(error?: ErrorMessage): NeverSchema {
  return {
    type: 'never',
    async: false,
    _parse(input, info) {
      return getSchemaIssues(
        info,
        'type',
        'never',
        error || 'Invalid type',
        input
      );
    },
  };
}
