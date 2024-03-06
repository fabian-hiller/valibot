import type {
  ObjectEntries,
  ObjectSchema,
  TupleItems,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types/schema.ts';
import { hasType } from '../../utils/index.ts';
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
export function getFallbacks<
  TSchema extends SchemaWithMaybeFallback<
    BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>
  >,
>(schema: TSchema): FallbackValues<TSchema> | undefined {
  // If schema has fallback, return its value
  if (schema.fallback !== undefined) {
    return getFallback(schema);
  }

  // If it is an object schema, return fallback of each entry
  if (hasType(schema, 'object')) {
    return Object.fromEntries(
      Object.entries(schema.entries).map(([key, value]) => [
        key,
        getFallbacks(value),
      ])
    ) as FallbackValues<TSchema>;
  }

  // If it is a tuple schema, return fallback of each item
  if (hasType(schema, 'tuple')) {
    return schema.items.map(getFallbacks) as FallbackValues<TSchema>;
  }

  // Otherwise, return undefined
  return undefined;
}
