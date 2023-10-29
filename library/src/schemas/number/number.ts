import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Number schema type.
 */
export type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  schema: 'number';
};

export function number(pipe?: Pipe<number>): NumberSchema;

export function number(error?: ErrorMessage, pipe?: Pipe<number>): NumberSchema;

/**
 * Creates a number schema.
 *
 * @param arg1 A validation and transformation pipe, or an error message.
 * @param arg2 A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(
  arg1?: ErrorMessage | Pipe<number>,
  arg2?: Pipe<number>
): NumberSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return number schema
  return {
    /**
     * The schema type.
     */
    schema: 'number',

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
      if (typeof input !== 'number' || isNaN(input)) {
        return getSchemaIssues(
          info,
          'type',
          'number',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'number');
    },
  };
}
