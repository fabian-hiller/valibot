import type { DefaultValue, SchemaWithMaybeDefault } from './types.ts';

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export function getDefault<TSchema extends SchemaWithMaybeDefault>(
  schema: TSchema
): DefaultValue<TSchema> {
  return typeof schema.default === 'function'
    ? schema.default()
    : schema.default;
}
