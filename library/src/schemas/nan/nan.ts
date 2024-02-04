import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
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
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'nan',
    async: false,
    message,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return schemaIssue(info, 'type', 'nan', this.message, input);
      }

      // Return parse result
      return parseResult(true, input as number);
    },
  };
}
