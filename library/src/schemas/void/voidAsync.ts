import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Void schema async type.
 */
export type VoidSchemaAsync<TOutput = void> = BaseSchemaAsync<void, TOutput> & {
  /**
   * The schema type.
   */
  type: 'void';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates an async void schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async void schema.
 */
export function voidAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): VoidSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'void',
    expects: 'void',
    async: true,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, voidAsync, input, config);
    },
  };
}

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
