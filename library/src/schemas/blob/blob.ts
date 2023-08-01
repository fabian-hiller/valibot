import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe, getErrorAndPipe } from '../../utils/index.ts';

/**
 * Blob schema type.
 */
export type BlobSchema<TOutput = Blob> = BaseSchema<Blob, TOutput> & {
  schema: 'blob';
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
export function blob(error?: string, pipe?: Pipe<Blob>): BlobSchema;

export function blob(
  arg1?: string | Pipe<Blob>,
  arg2?: Pipe<Blob>
): BlobSchema {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return blob schema
  return {
    /**
     * The schema type.
     */
    schema: 'blob',

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
    parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'blob',
            origin: 'value',
            message: error || i18next.t("schemas.blob"),
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, { ...info, reason: 'blob' });
    },
  };
}
