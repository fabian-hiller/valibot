import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
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
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'null',
    expects: 'null',
    async: false,
    message,
    metadata,
    _parse(input, config) {
      // If type is valid, return schema result
      if (input === null) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, null_, input, config);
    },
  };
}

/**
 * See {@link null_}
 *
 * @deprecated Use `null_` instead.
 */
export const nullType = null_;
