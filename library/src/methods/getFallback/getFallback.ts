import type { BaseSchema, Output } from '../../types/index.ts';
import type { FallbackInfo } from '../fallback/types.ts';
import type { FallbackValue } from './types.ts';

/**
 * Schema with maybe fallback type.
 */
export type SchemaWithMaybeFallback<TSchema extends BaseSchema = BaseSchema> =
  TSchema & {
    /**
     * The optional fallback value.
     */
    fallback?: Output<TSchema> | ((info?: FallbackInfo) => Output<TSchema>);
  };

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
