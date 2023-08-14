import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPipeInfo,
} from '../../utils/index.ts';

/**
 * Bigint schema async type.
 */
export type BigintSchemaAsync<TOutput = bigint> = BaseSchemaAsync<
  bigint,
  TOutput
> & {
  schema: 'bigint';
};

/**
 * Creates an async bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
export function bigintAsync(pipe?: PipeAsync<bigint>): BigintSchemaAsync;

/**
 * Creates an async bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
export function bigintAsync(
  error?: string,
  pipe?: PipeAsync<bigint>
): BigintSchemaAsync;

export function bigintAsync(
  arg1?: string | PipeAsync<bigint>,
  arg2?: PipeAsync<bigint>
): BigintSchemaAsync {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return async bigint schema
  return {
    /**
     * The schema type.
     */
    schema: 'bigint',

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
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'bigint') {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'bigint',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, getPipeInfo(info, 'bigint'));
    },
  };
}
