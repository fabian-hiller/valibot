import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
  type: 'any';
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<any>;
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
    type: 'any',
    async: false,
    pipe,

    _parse(input, info) {
      return executePipe(input, pipe, info, 'any');
    },
  };
}
