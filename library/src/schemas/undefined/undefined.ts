import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue, schemaResult } from '../../utils/index.ts';

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
  message: ErrorMessage | undefined;
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
  const [message, , metadata] = defaultArgs(messageOrMetadata, undefined);
  return {
    type: 'undefined',
    expects: 'undefined',
    async: false,
    message,
    metadata,
    _parse(input, config) {
      // If type is valid, return schema result
      if (input === undefined) {
        return schemaResult(true, input);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, undefined_, input, config);
    },
  };
}

/**
 * See {@link undefined_}
 *
 * @deprecated Use `undefined_` instead.
 */
export const undefinedType = undefined_;
