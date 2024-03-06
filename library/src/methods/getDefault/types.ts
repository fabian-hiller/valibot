import type { Input } from '../../types/index.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { SchemaWithMaybeDefaultAsync } from './getDefaultAsync.ts';

/**
 * Default value inference type.
 */
export type DefaultValue<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync,
> = TSchema['default'] extends Input<TSchema> | undefined
  ? TSchema['default']
  : TSchema['default'] extends () => Input<TSchema> | undefined
    ? ReturnType<TSchema['default']>
    : TSchema['default'] extends () => Promise<Input<TSchema> | undefined>
      ? Awaited<ReturnType<TSchema['default']>>
      : undefined;
