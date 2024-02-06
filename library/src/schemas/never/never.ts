import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
} from '../../types/index.ts';
import { defaultArgs, schemaIssue } from '../../utils/index.ts';

/**
 * Never schema type.
 */
export type NeverSchema = BaseSchema<never> & {
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
 * Creates a never schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 *
 * @returns A never schema.
 */
export function never(messageOrMetadata?: ErrorMessageOrMetadata): NeverSchema {
  // Extracts the message and metadata from the input.
  const [message = 'Invalid type', , metadata] = defaultArgs(
    messageOrMetadata,
    undefined
  );
  return {
    type: 'never',
    expects: 'never',
    async: false,
    message,
    metadata,
    _parse(input, config) {
      return schemaIssue(this, never, input, config);
    },
  };
}
