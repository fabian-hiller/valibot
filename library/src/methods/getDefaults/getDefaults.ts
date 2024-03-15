import type {
  ObjectEntries,
  ObjectSchema,
  TupleItems,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types/schema.ts';
import { isOfType } from '../../utils/index.ts';
import {
  getDefault,
  type SchemaWithMaybeDefault,
} from '../getDefault/index.ts';
import type { DefaultValues } from './types.ts';

/**
 * Returns the default values of the schema.
 *
 * Hint: The difference to `getDefault` is that for objects and tuples without
 * an explicit default value, this function recursively returns the default
 * values of the subschemas instead of `undefined`.
 *
 * @param schema The schema to get the default values from.
 *
 * @returns The default values.
 */
export function getDefaults<
  TSchema extends SchemaWithMaybeDefault<
    BaseSchema | ObjectSchema<ObjectEntries, any> | TupleSchema<TupleItems, any>
  >,
>(schema: TSchema): DefaultValues<TSchema> | undefined {
  // If schema has default, return its value
  if (schema.default !== undefined) {
    return getDefault(schema);
  }

  // If it is an object schema, return default of each entry
  if (isOfType('object', schema)) {
    return Object.fromEntries(
      Object.entries(schema.entries).map(([key, value]) => [
        key,
        getDefaults(value),
      ])
    ) as DefaultValues<TSchema>;
  }

  // If it is a tuple schema, return default of each item
  if (isOfType('tuple', schema)) {
    return schema.items.map(getDefaults) as DefaultValues<TSchema>;
  }

  // Otherwise, return undefined
  return undefined;
}
