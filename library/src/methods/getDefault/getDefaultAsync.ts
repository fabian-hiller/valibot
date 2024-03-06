import type { BaseSchemaAsync, DefaultAsync } from '../../types/index.ts';
import type { SchemaWithMaybeDefault } from './getDefault.ts';
import type { DefaultValue } from './types.ts';

/**
 * Schema with maybe default async type.
 */
export type SchemaWithMaybeDefaultAsync<
  TSchema extends BaseSchemaAsync = BaseSchemaAsync,
  TDefault extends DefaultAsync<TSchema> = DefaultAsync<TSchema>,
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
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync,
>(schema: TSchema): Promise<DefaultValue<TSchema>> {
  return typeof schema.default === 'function'
    ? await schema.default()
    : schema.default;
}
