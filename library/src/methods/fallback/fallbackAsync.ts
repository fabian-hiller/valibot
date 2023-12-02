import type { BaseSchemaAsync, Output } from '../../types/index.ts';
import { parseResult } from '../../utils/index.ts';
import { getFallbackAsync } from '../getFallback/index.ts';
import type { FallbackInfo } from './types.ts';

/**
 * Schema with fallback async type.
 */
export type SchemaWithFallbackAsync<
  TSchema extends BaseSchemaAsync = BaseSchemaAsync,
  TFallback extends
    | Output<TSchema>
    | ((
        info?: FallbackInfo
      ) => Output<TSchema> | Promise<Output<TSchema>>) = Output<TSchema>
> = TSchema & {
  /**
   * The fallback value.
   */
  fallback: TFallback;
};

/**
 * Returns a fallback value when validating the passed schema failed.
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
    async _parse(input, info) {
      const result = await schema._parse(input, info);
      return result.issues
        ? parseResult(
            true,
            await getFallbackAsync(this, { input, issues: result.issues })
          )
        : result;
    },
  };
}
