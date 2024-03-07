import type { BaseSchema } from '../../types/index.ts';
import type { Fallback } from '../fallback/index.ts';
import type { FallbackInfo } from '../fallback/types.ts';
import type { FallbackValue } from './types.ts';

/**
 * Schema with maybe fallback type.
 */
export type SchemaWithMaybeFallback<
  TSchema extends BaseSchema = BaseSchema,
  TFallback extends Fallback<TSchema> = Fallback<TSchema>,
> = TSchema & {
  /**
   * The optional fallback value.
   */
  fallback?: TFallback;
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
