import type { BaseSchema, Output } from '../../types.ts';
import { getOutput } from '../../utils/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Schema with fallback type.
 */
export type SchemaWithFallback<
  TSchema extends BaseSchema = BaseSchema,
  TFallback extends Output<TSchema> = Output<TSchema>
> = TSchema & { getFallback: (info?: FallbackInfo) => TFallback };

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
  value: TFallback | ((info?: FallbackInfo) => TFallback)
): SchemaWithFallback<TSchema, TFallback> {
  return {
    ...schema,

    /**
     * Returns the default value.
     *
     * @param info The fallback info.
     *
     * @returns The default value.
     */
    getFallback(info) {
      return typeof value === 'function'
        ? (value as (info?: FallbackInfo) => TFallback)(info)
        : (value as TFallback);
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
