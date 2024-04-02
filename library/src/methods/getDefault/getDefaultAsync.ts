import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
} from '../../types/index.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { DefaultValue } from './types.ts';

/**
 * Schema with maybe default async type.
 */
export type SchemaWithMaybeDefaultAsync<
  TSchema extends BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends DefaultAsync<TSchema>,
> = TSchema & {
  /**
   * The optional default value.
   */
  default?: TDefault;
};

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export async function getDefaultAsync<
  const TSchema extends
    | SchemaWithMaybeDefault<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >
    | SchemaWithMaybeDefaultAsync<
        BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
        DefaultAsync<BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>>
      >,
>(schema: TSchema): Promise<DefaultValue<TSchema>> {
  return typeof schema.default === 'function'
    ? await schema.default()
    : schema.default;
}
