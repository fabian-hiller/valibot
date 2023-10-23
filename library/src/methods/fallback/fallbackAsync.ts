import type { BaseSchemaAsync, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Returns a fallback value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param value The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<
  TSchema extends BaseSchemaAsync,
  TFallback extends Output<TSchema>
>(
  schema: TSchema,
  fallback_:
    | TFallback
    | ((info?: FallbackInfo) => TFallback | Promise<TFallback>)
): TSchema & { getFallback: (info?: FallbackInfo) => Promise<TFallback> } {
  return {
    ...schema,

    /**
     * Returns the default value.
     */
    async getFallback(info) {
      return typeof fallback_ === 'function'
        ? await (
            fallback_ as (info?: FallbackInfo) => TFallback | Promise<TFallback>
          )(info)
        : (fallback_ as TFallback);
    },

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      return getOutput(
        result.issues
          ? await this.getFallback({ input, issues: result.issues })
          : result.output
      );
    },
  };
}
