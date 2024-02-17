import type { BaseSchemaAsync, Output } from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';
import { getFallbackAsync } from '../getFallback/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Schema with fallback async type.
 */
export interface SchemaWithFallbackAsync<TInput = any, TOutput = TInput>
  extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The fallback value.
   */
  fallback: TOutput | ((info?: FallbackInfo) => TOutput | Promise<TOutput>);
}

/**
 * Returns a fallback output value when validating the passed schema failed.
 *
 * @param schema The schema to catch.
 * @param fallback The fallback value.
 *
 * @returns The passed schema.
 */
export function fallbackAsync<
  TSchema extends BaseSchemaAsync,
  const TFallback extends
    | Output<TSchema>
    | ((info?: FallbackInfo) => Output<TSchema> | Promise<Output<TSchema>>)
>(
  schema: TSchema,
  fallback: TFallback
): SchemaWithFallbackAsync<TSchema, TFallback> {
  return {
    ...schema,
    fallback,
    async _parse(input, config) {
      const result = await schema._parse(input, config);
      return result.issues
        ? schemaResult(
            true,
            await getFallbackAsync(this, { input, issues: result.issues })
          )
        : result;
    },
  };
}
