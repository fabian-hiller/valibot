import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
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
 * Creates an async null schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async null schema.
 */
export function nullAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): NullSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'null',
    expects: 'null',
    async: true,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (input === null) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, nullAsync, input, config);
    },
  };
}

/**
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
export const nullTypeAsync = nullAsync;
