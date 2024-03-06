import type { BaseSchema, Default } from '../../types/index.ts';
import type { DefaultValue } from './types.ts';

/**
 * Schema with maybe default type.
 */
export type SchemaWithMaybeDefault<
  TSchema extends BaseSchema = BaseSchema,
  TDefault extends Default<TSchema> = Default<TSchema>,
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
export function getDefault<TSchema extends SchemaWithMaybeDefault>(
  schema: TSchema
): DefaultValue<TSchema> {
  return typeof schema.default === 'function'
    ? schema.default()
    : schema.default;
}
