import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

/**
 * Undefined schema async type.
 */
export type UndefinedSchemaAsync<TOutput = undefined> = BaseSchemaAsync<
  undefined,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'undefined';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
};

/**
 * Creates an async undefined schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async undefined schema.
 */
export function undefinedAsync(
  messageOrMetadata?: ErrorMessageOrMetadata
): UndefinedSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'undefined',
    expects: 'undefined',
    async: true,
    message,
    metadata,
    async _parse(input, config) {
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, undefinedAsync, input, config);
    },
  };
}

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;
