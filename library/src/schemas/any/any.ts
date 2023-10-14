import type { BaseSchema, Pipe, PipeMeta } from '../../types.ts';
import { executePipe, getChecks } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
  kind: 'any';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
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
    kind: 'any',
    async: false,
    checks: getChecks(pipe),

    _parse(input, info) {
      return executePipe(input, pipe, info, 'any');
    },
  };
}
