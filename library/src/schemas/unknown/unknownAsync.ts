import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import { executePipeAsync } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export type UnknownSchemaAsync<TOutput = unknown> = BaseSchemaAsync<
  unknown,
  TOutput
> & {
  type: 'unknown';
  /**
   * Validation and transformation pipe.
   */
  pipe: PipeAsync<unknown>;
};

/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export function unknownAsync(
  pipe: PipeAsync<unknown> = []
): UnknownSchemaAsync {
  return {
    type: 'unknown',
    async: true,
    pipe,
    async _parse(input, info) {
      return executePipeAsync(input, pipe, info, 'unknown');
    },
  };
}
