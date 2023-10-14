import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  kind: 'unknown';
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<unknown>;
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
    kind: 'unknown',
    async: false,
    pipe,
    _parse(input, info) {
      return executePipe(input, pipe, info, 'unknown');
    },
  };
}
