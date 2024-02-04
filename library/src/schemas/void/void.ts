import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Void schema type.
 */
export type VoidSchema<TOutput = void> = BaseSchema<void, TOutput> & {
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
 * Creates a void schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A void schema.
 */
export function void_(messageOrMetadata?: ErrorMessageOrMetadata): VoidSchema {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'void',
    async: false,
    message,
    metadata,
    _parse(input, info) {
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
 * See {@link void_}
 *
 * @deprecated Use `void_` instead.
 */
export const voidType = void_;
