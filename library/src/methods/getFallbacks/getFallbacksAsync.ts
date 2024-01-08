import { isObjectSchema, isTupleSchema } from '../../schemas/index.ts';
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
  TSchema extends SchemaWithMaybeFallback | SchemaWithMaybeFallbackAsync
>(schema: TSchema): Promise<FallbackValues<TSchema> | undefined> {
  // If schema has a fallback, set its value
  if (schema.fallback !== undefined) {
    return getFallbackAsync(schema);
  }
  // Otherwise, check if schema is of kind object or tuple
  // If it is an object schema, set object with fallback value of each entry
  if (isObjectSchema(schema)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.entries).map(async ([key, value]) => [
          key,
          await getFallbacksAsync(value),
        ])
      )
    );
  }
  // If it is a tuple schema, set array with fallback value of each item
  if (isTupleSchema(schema)) {
    return Promise.all(
      schema.items.map(getFallbacksAsync)
    ) as FallbackValues<TSchema>;
  }
}
