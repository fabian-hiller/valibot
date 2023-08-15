import type { BaseSchema, BaseSchemaAsync } from '../../types.ts';

/**
 * Retrieves default values from a schema.
 *
 * @param schema The affected schema.
 *
 * @returns Default values .
 */
export function getDefault<TSchema extends BaseSchema | BaseSchemaAsync>(
  schema: TSchema
): TSchema {
  return schema._getDefault?.();
}
