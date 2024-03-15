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
  TSchema extends
    | SchemaWithMaybeDefault<
        | BaseSchema
        | ObjectSchema<ObjectEntries, any>
        | TupleSchema<TupleItems, any>
      >
    | SchemaWithMaybeDefaultAsync<
        | BaseSchemaAsync
        | ObjectSchemaAsync<ObjectEntriesAsync, any>
        | TupleSchemaAsync<TupleItemsAsync, any>
      >,
>(schema: TSchema): Promise<DefaultValues<TSchema> | undefined> {
  // If schema contains default, return its value
  if (schema.default !== undefined) {
    return getDefaultAsync(schema);
  }

  // If it is an object schema, return default of each entry
  if (isOfType('object', schema)) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(schema.entries).map(async ([key, value]) => [
          key,
          await getDefaultsAsync(value),
        ])
      )
    ) as DefaultValues<TSchema>;
  }

  // If it is a tuple schema, return default of each item
  if (isOfType('tuple', schema)) {
    return Promise.all(
      schema.items.map(getDefaultsAsync)
    ) as DefaultValues<TSchema>;
  }

  // Otherwise, return undefined
  return undefined;
}
