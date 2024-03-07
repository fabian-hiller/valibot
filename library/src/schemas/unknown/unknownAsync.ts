import type { BaseSchemaAsync, PipeAsync } from '../../types/index.ts';
import { pipeResultAsync } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export interface UnknownSchemaAsync<TOutput = unknown>
  extends BaseSchemaAsync<unknown, TOutput> {
  /**
   * The schema type.
   */
  type: 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<unknown> | undefined;
}

/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export function unknownAsync(pipe?: PipeAsync<unknown>): UnknownSchemaAsync {
  return {
    type: 'unknown',
    expects: 'unknown',
    async: true,
    pipe,
    async _parse(input, config) {
      return pipeResultAsync(this, input, config);
    },
  };
}
