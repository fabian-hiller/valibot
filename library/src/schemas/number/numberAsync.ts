import { ValiError } from '../../error/index.ts';
import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
  getPipeInfo,
} from '../../utils/index.ts';

/**
 * Number schema async type.
 */
export type NumberSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  schema: 'number';
};

/**
 * Creates an async number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(pipe?: PipeAsync<number>): NumberSchemaAsync;

/**
 * Creates an async number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(
  error?: string,
  pipe?: PipeAsync<number>
): NumberSchemaAsync;

export function numberAsync(
  arg1?: string | PipeAsync<number>,
  arg2?: PipeAsync<number>
): NumberSchemaAsync {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return async number schema
  return {
    /**
     * The schema type.
     */
    schema: 'number',

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
      if (typeof input !== 'number') {
        throw new ValiError([
          getIssue(info, {
            reason: 'type',
            validation: 'number',
            message: error || 'Invalid type',
            input,
          }),
        ]);
      }

      // Execute pipe and return output
      return executePipeAsync(input, pipe, getPipeInfo(info, 'number'));
    },
  };
}
