import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getErrorAndPipe,
  getIssue,
} from '../../utils/index.ts';

/**
 * Boolean schema async type.
 */
export type BooleanSchemaAsync<TOutput = boolean> = BaseSchemaAsync<
  boolean,
  TOutput
> & {
  schema: 'boolean';
};

/**
 * Creates an async boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
export function booleanAsync(pipe?: PipeAsync<boolean>): BooleanSchemaAsync;

/**
 * Creates an async boolean schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
export function booleanAsync(
  error?: string,
  pipe?: PipeAsync<boolean>
): BooleanSchemaAsync;

export function booleanAsync(
  arg1?: string | PipeAsync<boolean>,
  arg2?: PipeAsync<boolean>
): BooleanSchemaAsync {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return async boolean schema
  return {
    /**
     * The schema type.
     */
    schema: 'boolean',

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
      if (typeof input !== 'boolean') {
        return {
          issues: [
            getIssue(info, {
              reason: 'type',
              validation: 'boolean',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'boolean');
    },
  };
}
