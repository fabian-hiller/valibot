import type { BaseSchema, Output } from '../../types.ts';
import type { DefaultValue } from './types.ts';

/**
 * Schema with maybe default type.
 */
export type SchemaWithMaybeDefault<TSchema extends BaseSchema = BaseSchema> =
  TSchema & { getDefault?: () => Output<TSchema> };

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
  return schema.getDefault?.();
}
