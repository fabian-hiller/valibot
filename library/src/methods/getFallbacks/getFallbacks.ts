import { isObjectSchema, isTupleSchema } from '../../schemas/index.ts';
import {
  getFallback,
  type SchemaWithMaybeFallback,
} from '../getFallback/index.ts';
import type { FallbackValues } from './types.ts';

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallback` is that for objects and tuples without
 * an explicit fallback value, this function recursively returns the fallback
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the fallback values from.
 *
 * @returns The fallback values.
 */
export function getFallbacks<TSchema extends SchemaWithMaybeFallback>(
  schema: TSchema
): FallbackValues<TSchema> | undefined {
  // If schema has a fallback, set its value
  if (schema.fallback !== undefined) {
    return getFallback(schema);
  }
  // Otherwise, check if schema is of kind object or tuple
  // If it is an object schema, set object with fallback value of each entry
  if (isObjectSchema(schema)) {
    return Object.entries(schema.entries).reduce(
      (hash, [key, value]) =>
        Object.assign(hash, { [key]: getFallbacks(value) }),
      {}
    ) as FallbackValues<TSchema>;
  }
  // If it is a tuple schema, set array with fallback value of each item
  if (isTupleSchema(schema)) {
    return schema.items.map(getFallbacks) as FallbackValues<TSchema>;
  }
}
