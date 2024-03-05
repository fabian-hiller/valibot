import type { BaseSchemaAsync, Output } from '../../types/index.ts';
import type { FallbackInfo } from '../fallback/types.ts';
import type { SchemaWithMaybeFallback } from './getFallback.ts';
import type { FallbackValue } from './types.ts';

/**
 * Schema with maybe fallback async type.
 */
export type SchemaWithMaybeFallbackAsync<
  TSchema extends BaseSchemaAsync = BaseSchemaAsync,
> = TSchema & {
  /**
   * The optional fallback value.
   */
  fallback?:
    | Output<TSchema>
    | ((info?: FallbackInfo) => Output<TSchema> | Promise<Output<TSchema>>);
};

/**
 * Returns the fallback value of the schema.
 *
 * @param schema The schema to get the fallback value from.
 * @param info The fallback info.
 *
 * @returns The fallback value.
 */
export async function getFallbackAsync<
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync,
>(schema: TSchema, info?: FallbackInfo): Promise<FallbackValue<TSchema>> {
  return typeof schema.fallback === 'function'
    ? await schema.fallback(info)
    : schema.fallback;
}
