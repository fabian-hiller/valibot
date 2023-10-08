import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * String schema type.
 */
export type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
  schema: 'string';
};

/**
 * Creates a string schema.
 * @param pipe A validation and transformation pipe.
 * @returns A string schema.
 */
export function string(pipe?: Pipe<string>): StringSchema;

/**
 * Creates a string schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 * @returns A string schema.
 */
export function string(error?: ErrorMessage, pipe?: Pipe<string>): StringSchema;

/**
 *
 * @param arg1
 * @param arg2
 */
export function string(
  arg1?: ErrorMessage | Pipe<string>,
  arg2?: Pipe<string>
): StringSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return string schema
  return {
    /**
     * The schema type.
     */
    schema: 'string',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     * @param input The input to be parsed.
     * @param info The parse info.
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return getSchemaIssues(
          info,
          'type',
          'string',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'string');
    },
  };
}
