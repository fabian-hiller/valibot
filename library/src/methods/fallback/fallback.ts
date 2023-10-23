import type { BaseSchema, Output } from '../../types.ts';
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
export function fallback<
  TSchema extends BaseSchema,
  TFallback extends Output<TSchema>
>(
  schema: TSchema,
  fallback_: TFallback | ((info?: FallbackInfo) => TFallback)
): TSchema & { getFallback: (info?: FallbackInfo) => TFallback } {
  return {
    ...schema,

    /**
     * Returns the default value.
     */
    getFallback(info) {
      return typeof fallback_ === 'function'
        ? (fallback_ as (info?: FallbackInfo) => TFallback)(info)
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
    _parse(input, info) {
      const result = schema._parse(input, info);
      return getOutput(
        result.issues
          ? this.getFallback({ input, issues: result.issues })
          : result.output
      );
    },
  };
}
