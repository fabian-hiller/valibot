import type { BaseSchemaAsync, PipeAsync, PipeMeta } from '../../types.ts';
import { executePipeAsync, getChecks } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  schema: 'any';
  checks: PipeMeta[];
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
     * Validation checks that will be run against
     * the input value.
     */
    checks: getChecks(pipe),

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      return executePipeAsync(input, pipe, info, 'any');
    },
  };
}
