import type { Output } from '../../types.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { SchemaWithMaybeDefaultAsync } from './getDefaultAsync.ts';

/**
 * Default value type.
 */
export type DefaultValue<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync
> = TSchema['getDefault'] extends () => Output<TSchema>
  ? ReturnType<TSchema['getDefault']>
  : TSchema['getDefault'] extends () => Promise<Output<TSchema>>
  ? Awaited<ReturnType<TSchema['getDefault']>>
  : undefined;
