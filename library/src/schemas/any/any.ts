import type { BaseSchema, Pipe } from '../../types/index.ts';
import { pipeResult } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export interface AnySchema<TOutput = any> extends BaseSchema<any, TOutput> {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<any> | undefined;
}

/**
 * Creates an any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An any schema.
 */
export function any(pipe?: Pipe<any>): AnySchema {
  return {
    type: 'any',
    expects: 'any',
    async: false,
    pipe,
    _parse(input, config) {
      return pipeResult(this, input, config);
    },
  };
}
