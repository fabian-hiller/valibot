import type { BaseSchemaAsync, PipeAsync } from '../../types.ts';
import { executePipeAsync, getPipeInfo } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  schema: 'any';
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
    /**
     * The schema type.
     */
    schema: 'any',

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
      return executePipeAsync(input, pipe, getPipeInfo(info, 'any'));
    },
  };
}
