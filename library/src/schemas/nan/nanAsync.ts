import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
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
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'nan',
    expects: 'NaN',
    async: true,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (Number.isNaN(input)) {
        return schemaResult(true, input as number);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, nanAsync, input, config);
    },
  };
}
