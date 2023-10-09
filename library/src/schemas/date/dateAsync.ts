import type { BaseSchemaAsync, ErrorMessage, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Date schema async type.
 */
export type DateSchemaAsync<TOutput = Date> = BaseSchemaAsync<Date, TOutput> & {
  schema: 'date';
};

export function dateAsync(pipe?: PipeAsync<Date>): DateSchemaAsync;

export function dateAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<Date>
): DateSchemaAsync;

/**
 * Creates an async date schema.
 *
 * @param arg1 A validation and transformation pipe, or an error message.
 * @param arg2 A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
export function dateAsync(
  arg1?: ErrorMessage | PipeAsync<Date>,
  arg2?: PipeAsync<Date>
): DateSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async date schema
  return {
    /**
     * The schema type.
     */
    schema: 'date',

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
      if (!(input instanceof Date)) {
        return getSchemaIssues(
          info,
          'type',
          'date',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'date');
    },
  };
}
