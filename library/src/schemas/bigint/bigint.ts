import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe, getErrorAndPipe } from '../../utils/index.ts';

/**
 * Bigint schema type.
 */
export type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
  schema: 'bigint';
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
export function bigint(error?: string, pipe?: Pipe<bigint>): BigintSchema;

export function bigint(
  arg1?: string | Pipe<bigint>,
  arg2?: Pipe<bigint>
): BigintSchema {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return bigint schema
  return {
    /**
     * The schema type.
     */
    schema: 'bigint',

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
      if (typeof input !== 'bigint') {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'bigint',
            origin: 'value',
            message: error || i18next.t("schemas.bigint"),
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, { ...info, reason: 'bigint' });
    },
  };
}
