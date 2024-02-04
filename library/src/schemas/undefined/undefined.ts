import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, parseResult, schemaIssue } from '../../utils/index.ts';

/**
 * Undefined schema type.
 */
export type UndefinedSchema<TOutput = undefined> = BaseSchema<
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
 * Creates a undefined schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A undefined schema.
 */
export function undefined_(
  messageOrMetadata?: ErrorMessageOrMetadata
): UndefinedSchema {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'undefined',
    async: false,
    message,
    metadata,
    _parse(input, info) {
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
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
