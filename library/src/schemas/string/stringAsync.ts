import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import { executePipeAsync, getErrorAndPipe } from '../../utils/index.ts';

/**
 * String schema async type.
 */
export type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<
  string,
  TOutput
> & {
  schema: 'string';
};

/**
 * Creates an async string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(pipe?: PipeAsync<string>): StringSchemaAsync;

/**
 * Creates an async string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  error?: string,
  pipe?: PipeAsync<string>
): StringSchemaAsync;

export function stringAsync(
  arg1?: string | PipeAsync<string>,
  arg2?: PipeAsync<string>
): StringSchemaAsync {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return async string schema
  return {
    /**
     * The schema type.
     */
    schema: 'string',

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
    parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'string',
            origin: 'value',
            message: error || i18next.t("schemas.stringAsync"),
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipeAsync(input, pipe, { ...info, reason: 'string' });
    },
  };
}
