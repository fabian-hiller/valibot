import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import { executePipeAsync } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  type: 'any';
  /**
   * Validation and transformation pipe.
   */
  pipe: PipeAsync<any>;
};

/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
export function anyAsync(pipe: PipeAsync<any> = []): AnySchemaAsync {
  return {
    type: 'any',
    async: true,
    pipe,
    async _parse(input, info) {
      return executePipeAsync(input, pipe, info, 'any');
    },
  };
}
