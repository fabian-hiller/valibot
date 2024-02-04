import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Null schema type.
 */
export type NullSchema<TOutput = null> = BaseSchema<null, TOutput> & {
  /**
   * The schema type.
   */
  type: 'null';
  /**
   * The error message.
   */
  message: ErrorMessage;
};

/**
 * Creates a null schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A null schema.
 */
export function null_(messageOrMetadata?: ErrorMessageOrMetadata): NullSchema {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'null',
    async: false,
    message,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (input !== null) {
        return schemaIssue(info, 'type', 'null', this.message, input);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
export const nullType = null_;
