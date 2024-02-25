import type { Output } from '../../types/index.ts';
import type { SchemaWithMaybeFallback } from './getFallback.ts';
import type { SchemaWithMaybeFallbackAsync } from './getFallbackAsync.ts';

/**
 * Fallback value inference type.
 */
export type FallbackValue<
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync,
> =
  TSchema['fallback'] extends Output<TSchema>
    ? TSchema['fallback']
    : TSchema['fallback'] extends () => Output<TSchema>
      ? ReturnType<TSchema['fallback']>
      : TSchema['fallback'] extends () => Promise<Output<TSchema>>
        ? Awaited<ReturnType<TSchema['fallback']>>
        : undefined;
