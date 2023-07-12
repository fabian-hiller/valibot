import type { BaseSchema, Pipe } from '../../types';
import { executePipe } from '../../utils';

/**
 * Any schema type.
 */
export type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
  schema: 'any';
};

/**
 * Creates a any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A any schema.
 */
export function any(pipe: Pipe<any> = []): AnySchema {
  return {
    /**
     * The schema type.
     */
    schema: 'any',

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
      return executePipe(input, pipe, { ...info, reason: 'any' });
    },
  };
}
