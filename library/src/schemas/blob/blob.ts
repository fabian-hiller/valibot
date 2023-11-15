import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A blob schema.
 */
export function blob(message?: ErrorMessage, pipe?: Pipe<Blob>): BlobSchema;

export function blob(
  arg1?: ErrorMessage | Pipe<Blob>,
  arg2?: Pipe<Blob>
): BlobSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg1, arg2);

  // Create and return blob schema
  return {
    type: 'blob',
    async: false,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        return getSchemaIssues(info, 'type', 'blob', this.message, input);
      }

      // Execute pipe and return result
      return executePipe(input, this.pipe, info, 'blob');
    },
  };
}
