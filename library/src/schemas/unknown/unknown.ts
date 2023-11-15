import type { BaseSchema, Pipe } from '../../types/index.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  /**
   * The schema type.
   */
  type: 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<unknown> | undefined;
};

/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export function unknown(pipe?: Pipe<unknown>): UnknownSchema {
  return {
    type: 'unknown',
    async: false,
    pipe,
    _parse(input, info) {
      return executePipe(input, this.pipe, info, 'unknown');
    },
  };
}
