import { executePipe, getDefaultArgs, getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString, Pipe } from '../../types.ts';
/**
 * Number schema type.
 */
export type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
  schema: 'number';
};

/**
 * Creates a number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(pipe?: Pipe<number>): NumberSchema;

/**
 * Creates a number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(error?: FString, pipe?: Pipe<number>): NumberSchema;

export function number(
  arg1?: FString | Pipe<number>,
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
      if (typeof input !== 'number') {
        return getIssues(
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
