import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import { executePipeAsync, getPipeInfo } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export type UnknownSchemaAsync<TOutput = unknown> = BaseSchemaAsync<
  unknown,
  TOutput
> & {
  schema: 'unknown';
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
    schema: 'unknown',

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
    async parse(input, info) {
      return executePipeAsync(input, pipe, getPipeInfo(info, 'unknown'));
    },
  };
}
