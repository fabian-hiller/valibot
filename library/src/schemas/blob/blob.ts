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
  message: ErrorMessage;
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
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return blob schema
  return {
    type: 'blob',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        return schemaIssue(info, 'type', 'blob', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'blob');
    },
  };
}
