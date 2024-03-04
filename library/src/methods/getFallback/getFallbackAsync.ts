import type { FallbackInfo } from '../fallback/types.ts';
import type {
  FallbackValue,
  SchemaWithMaybeFallback,
  SchemaWithMaybeFallbackAsync,
} from './types.ts';

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
