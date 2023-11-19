import type { BaseSchema, Pipe } from '../../types/index.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<any> | undefined;
};

/**
 * Creates a any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A any schema.
 */
export function any(pipe?: Pipe<any>): AnySchema {
  return {
    type: 'any',
    async: false,
    pipe,
    _parse(input, info) {
      return executePipe(input, this.pipe, info, 'any');
    },
  };
}
