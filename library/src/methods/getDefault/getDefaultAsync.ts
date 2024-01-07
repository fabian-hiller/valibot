import type {
  DefaultValue,
  SchemaWithMaybeDefault,
  SchemaWithMaybeDefaultAsync,
} from './types.ts';

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export async function getDefaultAsync<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync
>(schema: TSchema): Promise<DefaultValue<TSchema>> {
  return typeof schema.default === 'function'
    ? await schema.default()
    : schema.default;
}
