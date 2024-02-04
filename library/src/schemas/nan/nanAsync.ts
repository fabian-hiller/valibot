import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * NaN schema async type.
 */
export type NanSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
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
 * Creates an async NaN schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async NaN schema.
 */
export function nanAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): NanSchemaAsync {
  // Extract message and metadata
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'nan',
    async: true,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (!Number.isNaN(input)) {
        return schemaIssue(info, 'type', 'nan', this.message, input);
      }

      // Return parse result
      return parseResult(true, input as number);
    },
  };
}
