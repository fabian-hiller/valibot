import { executePipe, getDefaultArgs, getIssues } from '../../utils/index.ts';

import type { BaseSchema, FString, Pipe } from '../../types.ts';
/**
 * Boolean schema type.
 */
export type BooleanSchema<TOutput = boolean> = BaseSchema<boolean, TOutput> & {
  schema: 'boolean';
};

/**
 * Creates a boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(pipe?: Pipe<boolean>): BooleanSchema;

/**
 * Creates a boolean schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(error?: FString, pipe?: Pipe<boolean>): BooleanSchema;

export function boolean(
  arg1?: FString | Pipe<boolean>,
  arg2?: Pipe<boolean>
): BooleanSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return boolean schema
  return {
    /**
     * The schema type.
     */
    schema: 'boolean',

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
      if (typeof input !== 'boolean') {
        return getIssues(
          info,
          'type',
          'boolean',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'boolean');
    },
  };
}
