import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Blob schema type.
 */
export type BlobSchema<TOutput = Blob> = BaseSchema<Blob, TOutput> & {
  type: 'blob';
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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
export function blob(error?: ErrorMessage, pipe?: Pipe<Blob>): BlobSchema;

export function blob(
  arg1?: ErrorMessage | Pipe<Blob>,
  arg2?: Pipe<Blob>
): BlobSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return blob schema
  return {
    /**
     * The schema type.
     */
    type: 'blob',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        return getSchemaIssues(
          info,
          'type',
          'blob',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'blob');
    },
  };
}
