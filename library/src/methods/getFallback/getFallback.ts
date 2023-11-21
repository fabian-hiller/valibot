import type { FallbackInfo } from '../fallback/types.ts';
import type { FallbackValue, SchemaWithMaybeFallback } from './types.ts';

/**
 * Returns the fallback value of the schema.
 *
 * @param schema The schema to get the fallback value from.
 * @param info The fallback info.
 *
 * @returns The fallback value.
 */
export function getFallback<TSchema extends SchemaWithMaybeFallback>(
  schema: TSchema,
  info?: FallbackInfo
): FallbackValue<TSchema> {
  return typeof schema.fallback === 'function'
    ? schema.fallback(info)
    : schema.fallback;
}
