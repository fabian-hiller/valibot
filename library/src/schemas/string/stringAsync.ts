import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
} from '../../utils/index.ts';

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
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'string',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'string');
    },
  };
}
