import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
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
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'void',
    async: true,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return schemaIssue(info, 'type', 'void', this.message, input);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link voidAsync}
 *
 * @deprecated Use `voidAsync` instead.
 */
export const voidTypeAsync = voidAsync;
