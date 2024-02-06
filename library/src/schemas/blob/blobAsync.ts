import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Blob schema async type.
 */
export type BlobSchemaAsync<TOutput = Blob> = BaseSchemaAsync<Blob, TOutput> & {
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
  pipe: PipeAsync<Blob> | undefined;
};

/**
 * Creates an async blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(pipe?: PipeAsync<Blob>): BlobSchemaAsync;

/**
 * Creates an async blob schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<Blob>
): BlobSchemaAsync;

export function blobAsync(
  arg1?: ErrorMessageOrMetadata | PipeAsync<Blob>,
  arg2?: PipeAsync<Blob>
): BlobSchemaAsync {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return async blob schema
  return {
    type: 'blob',
    expects: 'Blob',
    async: true,
    message,
    pipe,
    metadata,
    async _parse(input, config) {
      // If type is valid, return pipe result
      if (input instanceof Blob) {
        return pipeResultAsync(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, blobAsync, input, config);
    },
  };
}
