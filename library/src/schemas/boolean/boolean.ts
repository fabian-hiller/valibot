import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getIssue,
  getPipeInfo,
} from '../../utils/index.ts';

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
export function boolean(error?: string, pipe?: Pipe<boolean>): BooleanSchema;

export function boolean(
  arg1?: string | Pipe<boolean>,
  arg2?: Pipe<boolean>
): BooleanSchema {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

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
    parse(input, info) {
      // Check type of input
      if (typeof input !== 'boolean') {
        throw new ValiError([
          getIssue(info, {
            reason: 'type',
            validation: 'boolean',
            message: error || 'Invalid type',
            input,
          }),
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, getPipeInfo(info, 'boolean'));
    },
  };
}
