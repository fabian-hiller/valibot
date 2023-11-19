import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { getSchemaIssues } from '../../utils/index.ts';

/**
 * Never schema type.
 */
export type NeverSchema = BaseSchema<never> & {
  /**
   * The schema type.
   */
  type: 'never';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates a never schema.
 *
 * @param message The error message.
 *
 * @returns A never schema.
 */
export function never(message: ErrorMessage = 'Invalid type'): NeverSchema {
  return {
    type: 'never',
    async: false,
    message,
    _parse(input, info) {
      return getSchemaIssues(info, 'type', 'never', this.message, input);
    },
  };
}
