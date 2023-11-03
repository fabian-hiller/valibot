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
    /**
     * The schema type.
     */
    type: 'unknown',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      return executePipeAsync(input, pipe, info, 'unknown');
    },
  };
}
