import type { BaseSchemaAsync, PipeAsync } from '../../types/index.ts';
import { pipeResultAsync } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export interface AnySchemaAsync<TOutput = any>
  extends BaseSchemaAsync<any, TOutput> {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<any> | undefined;
}

/**
 * Creates an async any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
export function anyAsync(pipe?: PipeAsync<any>): AnySchemaAsync {
  return {
    type: 'any',
    expects: 'any',
    async: true,
    pipe,
    async _parse(input, config) {
      return pipeResultAsync(this, input, config);
    },
  };
}
