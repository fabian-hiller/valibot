import type { BaseSchema, ErrorMessage } from '../../types/index.ts';
import { schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export interface VoidSchema<TOutput = void> extends BaseSchema<void, TOutput> {
  /**
   * The schema type.
   */
  type: 'void';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
}

/**
 * Creates a void schema.
 *
 * @param message The error message.
 *
 * @returns A void schema.
 */
export function void_(message?: ErrorMessage): VoidSchema {
  return {
    type: 'void',
    expects: 'void',
    async: false,
    message,
    _parse(input, config) {
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, void_, input, config);
    },
  };
}
