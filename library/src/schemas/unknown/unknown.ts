import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  schema: 'unknown';
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
