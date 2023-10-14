import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Bigint schema type.
 */
export type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
  kind: 'bigint';
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<bigint>;
};

/**
 * Creates a bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(pipe?: Pipe<bigint>): BigintSchema;

/**
 * Creates a bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(error?: ErrorMessage, pipe?: Pipe<bigint>): BigintSchema;

export function bigint(
  arg1?: ErrorMessage | Pipe<bigint>,
  arg2?: Pipe<bigint>
): BigintSchema {
  // Get error and pipe argument
  const [error, pipe = []] = getDefaultArgs(arg1, arg2);

  // Create and return bigint schema
  return {
    kind: 'bigint',
    async: false,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'bigint') {
        return getSchemaIssues(
          info,
          'type',
          'bigint',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'bigint');
    },
  };
}
