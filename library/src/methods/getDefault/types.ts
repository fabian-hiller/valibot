import type { Output } from '../../types/index.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { SchemaWithMaybeDefaultAsync } from './getDefaultAsync.ts';

/**
 * Default value inference type.
 */
export type DefaultValue<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync,
> = TSchema['default'] extends Output<TSchema> | undefined
  ? TSchema['default']
  : TSchema['default'] extends () => Output<TSchema> | undefined
    ? ReturnType<TSchema['default']>
    : TSchema['default'] extends () => Promise<Output<TSchema> | undefined>
      ? Awaited<ReturnType<TSchema['default']>>
      : undefined;
