import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Date schema type.
 */
export type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput> & {
  schema: 'date';
};

/**
 * Creates a date schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(pipe?: Pipe<Date>): DateSchema;

/**
 * Creates a date schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(error?: ErrorMessage, pipe?: Pipe<Date>): DateSchema;

export function date(
  arg1?: ErrorMessage | Pipe<Date>,
  arg2?: Pipe<Date>
): DateSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return date schema
  return {
    /**
     * The schema type.
     */
    schema: 'date',

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
      return executePipe(input, pipe, info, 'date');
    },
  };
}
