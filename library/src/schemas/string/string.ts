import { ValiError } from '../../error';
import type { BaseSchema, Pipe } from '../../types';
import { executePipe, getErrorAndPipe } from '../../utils';

/**
 * String schema type.
 */
export type StringSchema<TOutput = string> = BaseSchema<string, TOutput> & {
  schema: 'string';
};

/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(pipe?: Pipe<string>): StringSchema;

/**
 * Creates a string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(error?: string, pipe?: Pipe<string>): StringSchema;

export function string(
  arg1?: string | Pipe<string>,
  arg2?: Pipe<string>
): StringSchema {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

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
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'string',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, { ...info, reason: 'string' });
    },
  };
}
