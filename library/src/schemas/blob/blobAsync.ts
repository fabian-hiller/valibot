import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getPipeInfo,
} from '../../utils/index.ts';

/**
 * Blob schema async type.
 */
export type BlobSchemaAsync<TOutput = Blob> = BaseSchemaAsync<Blob, TOutput> & {
  schema: 'blob';
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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(
  error?: string,
  pipe?: PipeAsync<Blob>
): BlobSchemaAsync;

export function blobAsync(
  arg1?: string | PipeAsync<Blob>,
  arg2?: PipeAsync<Blob>
): BlobSchemaAsync {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return async blob schema
  return {
    /**
     * The schema type.
     */
    schema: 'blob',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'blob',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipeAsync(input, pipe, getPipeInfo(info, 'blob'));
    },
  };
}
