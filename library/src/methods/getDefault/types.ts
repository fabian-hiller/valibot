import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  Default,
  DefaultAsync,
  InferInput,
} from '../../types/index.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { SchemaWithMaybeDefaultAsync } from './getDefaultAsync.ts';

/**
 * Default value inference type.
 */
export type DefaultValue<
  TSchema extends
    | SchemaWithMaybeDefault<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | SchemaWithMaybeDefaultAsync<
        BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>
      >,
> = TSchema['default'] extends InferInput<TSchema> | undefined
  ? TSchema['default']
  : TSchema['default'] extends () => InferInput<TSchema> | undefined
    ? ReturnType<TSchema['default']>
    : TSchema['default'] extends () => Promise<InferInput<TSchema> | undefined>
      ? Awaited<ReturnType<TSchema['default']>>
      : undefined;
