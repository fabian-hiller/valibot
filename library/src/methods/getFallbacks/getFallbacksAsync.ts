import type {
  ObjectEntries,
  ObjectEntriesAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  TupleItems,
  TupleItemsAsync,
  TupleSchema,
  TupleSchemaAsync,
} from '../../schemas/index.ts';
import type { BaseSchema, BaseSchemaAsync } from '../../types/schema.ts';
import { isOfType } from '../../utils/index.ts';
import {
  getFallbackAsync,
  type SchemaWithMaybeFallback,
  type SchemaWithMaybeFallbackAsync,
} from '../getFallback/index.ts';
import type { FallbackValues } from './types.ts';

/**
 * Returns the fallback values of the schema.
 *
 * Hint: The difference to `getFallbackAsync` is that for objects and tuples
 * without an explicit fallback value, this function recursively returns the
 * fallback values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the fallback values from.
 *
 * @returns The fallback values.
 */
export async function getFallbacksAsync<
  TSchema extends
    | SchemaWithMaybeFallback<
        | BaseSchema
        | ObjectSchema<ObjectEntries, any>
        | TupleSchema<TupleItems, any>
      >
    | SchemaWithMaybeFallbackAsync<
        | BaseSchemaAsync
        | ObjectSchemaAsync<ObjectEntriesAsync, any>
        | TupleSchemaAsync<TupleItemsAsync, any>
      >,
>(schema: TSchema): Promise<FallbackValues<TSchema> | undefined> {
  // If schema has fallback, return its value
  if (schema.fallback !== undefined) {
    return getFallbackAsync(schema);
  }

  // If it is an object schema, return fallback of each entry
  if (isOfType('object', schema)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.entries).map(async ([key, value]) => [
          key,
          await getFallbacksAsync(value),
        ])
      )
    ) as FallbackValues<TSchema>;
  }

  // If it is a tuple schema, return fallback of each item
  if (isOfType('tuple', schema)) {
    return Promise.all(
      schema.items.map(getFallbacksAsync)
    ) as FallbackValues<TSchema>;
  }

  // Otherwise, return undefined
  return undefined;
}
