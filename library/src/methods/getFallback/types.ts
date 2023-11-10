import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';
import type {
  SchemaWithFallback,
  SchemaWithFallbackAsync,
} from '../fallback/index.ts';
import type { SchemaWithMaybeFallback } from './getFallback.ts';
import type { SchemaWithMaybeFallbackAsync } from './getFallbackAsync.ts';

/**
 * Fallback value type.
 */
export type FallbackValue<
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync
> = TSchema extends
  | SchemaWithFallback<BaseSchema, infer TFallback>
  | SchemaWithFallbackAsync<BaseSchemaAsync, infer TFallback>
  ? TFallback
  : undefined;
