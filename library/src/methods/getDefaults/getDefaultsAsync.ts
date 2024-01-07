import { isObjectSchema, isTupleSchema } from '../../schemas/index.ts';
import {
  getDefaultAsync,
  type SchemaWithMaybeDefault,
  type SchemaWithMaybeDefaultAsync,
} from '../getDefault/index.ts';
import type { DefaultValues } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * The difference to `getDefaultAsync` is that for objects and tuples without
 * an explicit default value, this function recursively returns the default
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
export async function getDefaultsAsync<
  TSchema extends SchemaWithMaybeDefault | SchemaWithMaybeDefaultAsync
>(schema: TSchema): Promise<DefaultValues<TSchema> | undefined> {
  // If schema contains a default function, set its default value
  if (schema.default) {
    return getDefaultAsync(schema);
  }
  // Otherwise, check if schema is of kind object or tuple
  // If it is an object schema, set object with default value of each entry
  if (isObjectSchema(schema)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.entries).map(async ([key, value]) => [
          key,
          await getDefaultsAsync(value),
        ])
      )
    );
  }
  // If it is a tuple schema, set array with default value of each item
  if (isTupleSchema(schema)) {
    return Promise.all(
      schema.items.map(getDefaultsAsync)
    ) as DefaultValues<TSchema>;
  }
}
