import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Blob schema type.
 */
export type BlobSchema<TOutput = Blob> = BaseSchema<Blob, TOutput> & {
  /**
   * The schema type.
   */
  type: 'blob';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<Blob> | undefined;
};

/**
 * Creates a blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
export function blob(pipe?: Pipe<Blob>): BlobSchema;

/**
 * Creates a blob schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
export function blob(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<Blob>
): BlobSchema;

export function blob(
  arg1?: ErrorMessageOrMetadata | Pipe<Blob>,
  arg2?: Pipe<Blob>
): BlobSchema {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return blob schema
  return {
    type: 'blob',
    expects: 'Blob',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (input instanceof Blob) {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, blob, input, config);
    },
  };
}
