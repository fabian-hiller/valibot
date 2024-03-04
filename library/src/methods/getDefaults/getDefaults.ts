import type {
  ObjectEntries,
  ObjectSchema,
  TupleItems,
  TupleSchema,
} from '../../schemas/index.ts';
import type { BaseSchema } from '../../types/schema.ts';
import { hasType } from '../../utils/index.ts';
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
  TSchema extends SchemaWithMaybeDefault &
    (BaseSchema | ObjectSchema<ObjectEntries> | TupleSchema<TupleItems>),
>(schema: TSchema): DefaultValues<TSchema> | undefined {
  // If schema contains a default function, set its default value
  if (schema.default !== undefined) {
    return getDefault(schema);
  }
  // Otherwise, check if schema is of kind object or tuple
  // If it is an object schema, set object with default value of each entry
  if (hasType(schema, 'object')) {
    return Object.fromEntries(
      Object.entries(schema.entries).map(([key, value]) => [
        key,
        getDefaults(value),
      ])
    ) as DefaultValues<TSchema>;
  }
  // If it is a tuple schema, set array with default value of each item
  if (hasType(schema, 'tuple')) {
    return schema.items.map(getDefaults) as DefaultValues<TSchema>;
  }
}
