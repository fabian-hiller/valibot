import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * NaN schema type.
 */
export type NanSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  /**
   * The schema type.
   */
  type: 'nan';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates a NaN schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A NaN schema.
 */
export function nan(messageOrMetadata?: ErrorMessageOrMetadata): NanSchema {
  // Extract message and metadata
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'nan',
    expects: 'NaN',
    async: false,
    message,
    metadata,
    _parse(input, config) {
      // If type is valid, return schema result
      if (Number.isNaN(input)) {
        return schemaResult(true, input as number);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, nan, input, config);
    },
  };
}
