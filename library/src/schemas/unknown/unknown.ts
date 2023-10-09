import type { BaseSchema, Pipe, PipeMeta } from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  schema: 'unknown';
  checks: PipeMeta[];
};

/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export function unknown(pipe: Pipe<unknown> = []): UnknownSchema {
  return {
    /**
     * The schema type.
     */
    schema: 'unknown',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Validation checks that will be run against
     * the input value.
     */
    checks: getChecks(pipe),

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      return executePipe(input, pipe, info, 'unknown');
    },
  };
}
