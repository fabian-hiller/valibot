import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types/index.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Blob schema async type.
 */
export interface BlobSchemaAsync<TOutput = Blob>
  extends BaseSchemaAsync<Blob, TOutput> {
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
  pipe: PipeAsync<Blob> | undefined;
}

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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<Blob>
): BlobSchemaAsync;

export function blobAsync(
  arg1?: ErrorMessage | PipeAsync<Blob>,
  arg2?: PipeAsync<Blob>
): BlobSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async blob schema
  return {
    type: 'blob',
    async: true,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        return getSchemaIssues(info, 'type', 'blob', this.message, input);
      }

      // Execute pipe and return result
      return executePipeAsync(input, this.pipe, info, 'blob');
    },
  };
}
