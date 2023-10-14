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
  kind: 'blob';
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<Blob>;
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
  const [error, pipe = []] = getDefaultArgs(arg1, arg2);

  // Create and return blob schema
  return {
    kind: 'blob',
    async: false,
    pipe,
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
