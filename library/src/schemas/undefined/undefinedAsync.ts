import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

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
  message: ErrorMessage;
};

/**
 * Creates an async undefined schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns An async undefined schema.
 */
export function undefinedAsync(
  messageOrMetadata: ErrorMessageOrMetadata = 'Invalid type'
): UndefinedSchemaAsync {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'undefined',
    async: true,
    message,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'undefined') {
        return schemaIssue(info, 'type', 'undefined', this.message, input);
      }

      // Return parse result
      return parseResult(true, input);
    },
  };
}

/**
 * See {@link undefinedAsync}
 *
 * @deprecated Use `undefinedAsync` instead.
 */
export const undefinedTypeAsync = undefinedAsync;
