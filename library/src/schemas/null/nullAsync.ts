import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
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
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'null',
    async: true,
    message,
    metadata,
    async _parse(input, info) {
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
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
export const nullTypeAsync = nullAsync;
