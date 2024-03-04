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
import { hasType } from '../../utils/index.ts';
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
    | (SchemaWithMaybeDefault &
        (BaseSchema | ObjectSchema<ObjectEntries> | TupleSchema<TupleItems>))
    | (SchemaWithMaybeDefaultAsync &
        (
          | BaseSchemaAsync
          | ObjectSchemaAsync<ObjectEntriesAsync>
          | TupleSchemaAsync<TupleItemsAsync>
        )),
>(schema: TSchema): Promise<DefaultValues<TSchema> | undefined> {
  // If schema contains a default function, set its default value
  if (schema.default !== undefined) {
    return getDefaultAsync(schema);
  }
  // Otherwise, check if schema is of kind object or tuple
  // If it is an object schema, set object with default value of each entry
  if (hasType(schema, 'object')) {
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
  if (hasType(schema, 'tuple')) {
    return Promise.all(
      schema.items.map(getDefaultsAsync)
    ) as DefaultValues<TSchema>;
  }
}
