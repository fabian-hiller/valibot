import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';

/**
 * Never schema async type.
 */
export type NeverSchemaAsync = BaseSchemaAsync<never> & {
  /**
   * The schema type.
   */
  type: 'never';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates an async never schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async never schema.
 */
export function neverAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): NeverSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'never',
    expects: 'never',
    async: true,
    message,
    metadata,
    async _parse(input, config) {
      return schemaIssue(this, neverAsync, input, config);
    },
  };
}
